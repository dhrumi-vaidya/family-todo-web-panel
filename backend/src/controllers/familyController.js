const Family = require('../models/Family');
const User = require('../models/User');

// Create new family
exports.createFamily = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if user already in a family
        if (req.familyId) {
            return res.status(400).json({ message: 'You are already in a family' });
        }

        // Create family
        const family = new Family({
            name,
            members: [req.userId],
            createdBy: req.userId
        });

        await family.save();

        // Update user's familyId and set as admin
        await User.findByIdAndUpdate(req.userId, {
            familyId: family._id,
            role: 'admin' // Creator becomes admin
        });

        res.status(201).json({
            family,
            message: 'Family created successfully. You are now the family admin.'
        });
    } catch (error) {
        console.error('Create family error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Join family with invite code
exports.joinFamily = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        // Check if user already in a family
        if (req.user.familyId) {
            return res.status(400).json({ message: 'You are already in a family' });
        }

        // Find family by invite code
        const family = await Family.findOne({ inviteCode });
        if (!family) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        // Add user to family
        family.members.push(req.userId);
        await family.save();

        // Update user's familyId
        req.user.familyId = family._id;
        await req.user.save();

        res.json({
            message: 'Successfully joined family',
            family: {
                id: family._id,
                name: family.name,
                inviteCode: family.inviteCode
            }
        });
    } catch (error) {
        console.error('Join family error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get family members
exports.getMembers = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You are not in a family' });
        }

        const family = await Family.findById(req.familyId).populate('members', 'name email');

        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }

        res.json({
            familyName: family.name,
            inviteCode: family.inviteCode,
            members: family.members
        });
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Leave family
exports.leaveFamily = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You are not in a family' });
        }

        const family = await Family.findById(req.familyId);

        // Remove user from family members
        family.members = family.members.filter(memberId => !memberId.equals(req.userId));
        await family.save();

        // Remove familyId from user
        req.user.familyId = null;
        await req.user.save();

        res.json({ message: 'Successfully left family' });
    } catch (error) {
        console.error('Leave family error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
