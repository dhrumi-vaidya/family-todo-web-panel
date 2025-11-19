const Bill = require('../models/Bill');

// Create bill
exports.createBill = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You must be in a family to create bills' });
        }

        const { title, description, amount, dueDate, category, isRecurring, recurringPeriod, assignedTo } = req.body;

        const bill = new Bill({
            title,
            description,
            amount,
            dueDate,
            category,
            isRecurring,
            recurringPeriod,
            assignedTo: assignedTo || req.userId,
            createdBy: req.userId,
            familyId: req.familyId
        });

        await bill.save();
        await bill.populate('createdBy assignedTo', 'name email');

        res.status(201).json(bill);
    } catch (error) {
        console.error('Create bill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get bills with filters
exports.getBills = async (req, res) => {
    try {
        const { isPaid, assignedTo, category } = req.query;

        const filter = { familyId: req.familyId };

        if (isPaid !== undefined) filter.isPaid = isPaid === 'true';
        if (assignedTo) filter.assignedTo = assignedTo;
        if (category) filter.category = category;

        const bills = await Bill.find(filter)
            .populate('createdBy assignedTo', 'name email')
            .sort({ dueDate: 1 });

        res.json(bills);
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark bill as paid
exports.markBillPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await Bill.findOne({ _id: id, familyId: req.familyId });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        bill.isPaid = true;
        bill.paidDate = new Date();
        await bill.save();
        await bill.populate('createdBy assignedTo', 'name email');

        res.json(bill);
    } catch (error) {
        console.error('Mark paid error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update bill
exports.updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const bill = await Bill.findOne({ _id: id, familyId: req.familyId });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        Object.keys(updates).forEach(key => {
            bill[key] = updates[key];
        });

        await bill.save();
        await bill.populate('createdBy assignedTo', 'name email');

        res.json(bill);
    } catch (error) {
        console.error('Update bill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete bill
exports.deleteBill = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await Bill.findOneAndDelete({
            _id: id,
            familyId: req.familyId
        });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Delete bill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get upcoming bills
exports.getUpcomingBills = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const bills = await Bill.find({
            familyId: req.familyId,
            isPaid: false,
            dueDate: {
                $gte: now,
                $lte: thirtyDaysLater
            }
        })
            .populate('createdBy assignedTo', 'name email')
            .sort({ dueDate: 1 });

        res.json(bills);
    } catch (error) {
        console.error('Get upcoming bills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
