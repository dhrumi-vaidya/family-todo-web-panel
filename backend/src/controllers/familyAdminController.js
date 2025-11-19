// Update member role (admin only)
exports.updateMemberRole = async (req, res) => {
    try {
        const { memberId, role } = req.body;

        // Check if requester is admin
        const requester = await User.findById(req.userId);
        if (requester.role !== 'admin') {
            return res.status(403).json({ message: 'Only family admin can change roles' });
        }

        // Check if member is in same family
        const member = await User.findById(memberId);
        if (!member || member.familyId.toString() !== req.familyId.toString()) {
            return res.status(404).json({ message: 'Member not found in your family' });
        }

        // Cannot remove admin role from family creator
        const family = await Family.findById(req.familyId);
        if (member._id.toString() === family.createdBy.toString() && role !== 'admin') {
            return res.status(400).json({ message: 'Cannot remove admin role from family creator' });
        }

        member.role = role;
        await member.save();

        res.json({ message: 'Member role updated successfully', member });
    } catch (error) {
        console.error('Update member role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove member from family (admin only)
exports.removeMember = async (req, res) => {
    try {
        const { memberId } = req.params;

        // Check if requester is admin
        const requester = await User.findById(req.userId);
        if (requester.role !== 'admin') {
            return res.status(403).json({ message: 'Only family admin can remove members' });
        }

        // Check if member is in same family
        const member = await User.findById(memberId);
        if (!member || member.familyId.toString() !== req.familyId.toString()) {
            return res.status(404).json({ message: 'Member not found in your family' });
        }

        // Cannot remove family creator
        const family = await Family.findById(req.familyId);
        if (member._id.toString() === family.createdBy.toString()) {
            return res.status(400).json({ message: 'Cannot remove family creator' });
        }

        // Remove from family
        member.familyId = null;
        member.role = 'member';
        await member.save();

        // Remove from family members array
        family.members = family.members.filter(m => m.toString() !== memberId);
        await family.save();

        res.json({ message: 'Member removed from family successfully' });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
