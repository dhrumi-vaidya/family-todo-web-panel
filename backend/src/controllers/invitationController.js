const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Family = require('../models/Family');
const emailService = require('../services/emailService');

// Send invitation to email
exports.sendInvitation = async (req, res) => {
    try {
        const { email } = req.body;

        if (!req.familyId) {
            return res.status(400).json({ message: 'You must be in a family to send invitations' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.familyId) {
            return res.status(400).json({ message: 'User already belongs to a family' });
        }

        // Check for existing pending invitation
        const existingInvite = await Invitation.findOne({
            email,
            familyId: req.familyId,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingInvite) {
            return res.status(400).json({ message: 'Invitation already sent to this email' });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Create invitation (expires in 7 days)
        const invitation = new Invitation({
            email,
            familyId: req.familyId,
            invitedBy: req.userId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        await invitation.save();

        // Get family and inviter info
        const family = await Family.findById(req.familyId);
        const inviter = await User.findById(req.userId);

        // Send invitation email
        const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invitation/${token}`;

        try {
            await emailService.sendInvitationEmail(
                email,
                family.name,
                inviteLink,
                inviter.name
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails - user can still use the link
        }

        res.status(201).json({
            message: 'Invitation sent successfully',
            inviteLink, // Return link for development/testing
            invitation: {
                email: invitation.email,
                status: invitation.status,
                expiresAt: invitation.expiresAt
            }
        });
    } catch (error) {
        console.error('Send invitation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get invitation details
exports.getInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await Invitation.findOne({ token })
            .populate('familyId', 'name')
            .populate('invitedBy', 'name');

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found or expired' });
        }

        if (invitation.status === 'rejected') {
            return res.status(400).json({ message: 'This invitation has been rejected' });
        }

        if (invitation.status === 'approved') {
            return res.status(400).json({ message: 'This invitation has already been used' });
        }

        res.json({
            email: invitation.email,
            familyName: invitation.familyId.name,
            invitedBy: invitation.invitedBy.name,
            status: invitation.status
        });
    } catch (error) {
        console.error('Get invitation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accept invitation (register with invitation)
exports.acceptInvitation = async (req, res) => {
    try {
        const { token, name, password } = req.body;

        const invitation = await Invitation.findOne({ token, status: 'pending' });

        if (!invitation) {
            return res.status(404).json({ message: 'Invalid or expired invitation' });
        }

        // Check if user already exists
        let user = await User.findOne({ email: invitation.email });

        if (user) {
            return res.status(400).json({ message: 'User already exists. Please login instead.' });
        }

        // Create new user
        user = new User({
            name,
            email: invitation.email,
            password,
            role: 'member'
        });

        await user.save();

        // Update invitation status to accepted (waiting for admin approval)
        invitation.status = 'accepted';
        invitation.userId = user._id;
        await invitation.save();

        res.status(201).json({
            message: 'Registration successful! Waiting for admin approval.',
            requiresApproval: true
        });
    } catch (error) {
        console.error('Accept invitation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get pending invitations (admin only)
exports.getPendingInvitations = async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view pending approvals' });
        }

        const invitations = await Invitation.find({
            familyId: req.familyId,
            status: 'accepted'
        })
            .populate('userId', 'name email')
            .populate('invitedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(invitations);
    } catch (error) {
        console.error('Get pending invitations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve or reject invitation (admin only)
exports.reviewInvitation = async (req, res) => {
    try {
        const { invitationId, approved } = req.body;

        // Check if user is admin
        const admin = await User.findById(req.userId);
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can approve/reject members' });
        }

        const invitation = await Invitation.findOne({
            _id: invitationId,
            familyId: req.familyId,
            status: 'accepted'
        });

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        const user = await User.findById(invitation.userId);

        if (approved) {
            // Approve - add to family
            user.familyId = req.familyId;
            await user.save();

            const family = await Family.findById(req.familyId);
            family.members.push(user._id);
            await family.save();

            invitation.status = 'approved';
            await invitation.save();

            // Send approval email
            try {
                await emailService.sendApprovalEmail(user.email, family.name, true);
            } catch (emailError) {
                console.error('Approval email failed:', emailError);
            }

            res.json({ message: 'Member approved successfully', user });
        } else {
            // Reject - delete user and update invitation
            await User.findByIdAndDelete(user._id);
            invitation.status = 'rejected';
            await invitation.save();

            // Send rejection email
            const family = await Family.findById(req.familyId);
            try {
                await emailService.sendApprovalEmail(invitation.email, family.name, false);
            } catch (emailError) {
                console.error('Rejection email failed:', emailError);
            }

            res.json({ message: 'Member request rejected' });
        }
    } catch (error) {
        console.error('Review invitation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
