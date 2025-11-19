const Budget = require('../models/Budget');

// Create or update budget
exports.setBudget = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You must be in a family to set budget' });
        }

        const { month, year, totalBudget, categories } = req.body;

        // Check if budget exists for this month/year
        let budget = await Budget.findOne({
            familyId: req.familyId,
            month,
            year
        });

        if (budget) {
            // Update existing budget
            budget.totalBudget = totalBudget;
            budget.categories = categories;
            await budget.save();
        } else {
            // Create new budget
            budget = new Budget({
                month,
                year,
                totalBudget,
                categories,
                familyId: req.familyId,
                createdBy: req.userId
            });
            await budget.save();
        }

        res.status(budget.isNew ? 201 : 200).json(budget);
    } catch (error) {
        console.error('Set budget error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get budget for specific month
exports.getBudget = async (req, res) => {
    try {
        const { year, month } = req.params;

        const budget = await Budget.findOne({
            familyId: req.familyId,
            year: parseInt(year),
            month: parseInt(month)
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found for this month' });
        }

        res.json(budget);
    } catch (error) {
        console.error('Get budget error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update spending in category
exports.updateSpending = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, amount } = req.body;

        const budget = await Budget.findOne({ _id: id, familyId: req.familyId });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        const category = budget.categories.find(c => c.name === categoryName);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.spent += amount;
        await budget.save();

        res.json(budget);
    } catch (error) {
        console.error('Update spending error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current month budget
exports.getCurrentBudget = async (req, res) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const budget = await Budget.findOne({
            familyId: req.familyId,
            year,
            month
        });

        res.json(budget || null);
    } catch (error) {
        console.error('Get current budget error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
