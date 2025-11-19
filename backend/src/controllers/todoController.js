const Todo = require('../models/Todo');

// Create new todo
exports.createTodo = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You must be in a family to create todos' });
        }

        const { title, description, priority, dueDate, scheduledTime, assignedTo, isCalendarEvent } = req.body;

        const todo = new Todo({
            title,
            description,
            priority,
            dueDate,
            scheduledTime,
            isCalendarEvent: isCalendarEvent || false,
            createdBy: req.userId,
            assignedTo: assignedTo || req.userId,
            familyId: req.familyId
        });

        await todo.save();
        await todo.populate('createdBy assignedTo', 'name email');

        res.status(201).json(todo);
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get todos with filters
exports.getTodos = async (req, res) => {
    try {
        const { status, assignedTo, createdBy } = req.query;

        const filter = { familyId: req.familyId };

        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (createdBy) filter.createdBy = createdBy;

        const todos = await Todo.find(filter)
            .populate('createdBy assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(todos);
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all family todos
exports.getFamilyTodos = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You are not in a family' });
        }

        const todos = await Todo.find({ familyId: req.familyId })
            .populate('createdBy assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(todos);
    } catch (error) {
        console.error('Get family todos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get upcoming scheduled tasks
exports.getUpcomingTodos = async (req, res) => {
    try {
        const now = new Date();

        const todos = await Todo.find({
            familyId: req.familyId,
            scheduledTime: { $gte: now },
            status: { $ne: 'completed' }
        })
            .populate('createdBy assignedTo', 'name email')
            .sort({ scheduledTime: 1 })
            .limit(20);

        res.json(todos);
    } catch (error) {
        console.error('Get upcoming todos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const todo = await Todo.findOne({ _id: id, familyId: req.familyId });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        Object.keys(updates).forEach(key => {
            todo[key] = updates[key];
        });

        await todo.save();
        await todo.populate('createdBy assignedTo', 'name email');

        res.json(todo);
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findOneAndDelete({
            _id: id,
            familyId: req.familyId
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
