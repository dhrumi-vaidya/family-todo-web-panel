const CalendarEvent = require('../models/CalendarEvent');

// Create calendar event
exports.createEvent = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You must be in a family to create events' });
        }

        const { title, description, startDateTime, endDateTime, location, color, isPersonal, attendees } = req.body;

        const event = new CalendarEvent({
            title,
            description,
            startDateTime,
            endDateTime,
            location,
            color,
            isPersonal: isPersonal || false,
            createdBy: req.userId,
            attendees: attendees || [],
            familyId: req.familyId
        });

        await event.save();
        await event.populate('createdBy attendees', 'name email');

        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get personal calendar events
exports.getPersonalEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.find({
            familyId: req.familyId,
            $or: [
                { createdBy: req.userId, isPersonal: true },
                { isPersonal: false }
            ]
        })
            .populate('createdBy attendees', 'name email')
            .sort({ startDateTime: 1 });

        res.json(events);
    } catch (error) {
        console.error('Get personal events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get family calendar events
exports.getFamilyEvents = async (req, res) => {
    try {
        if (!req.familyId) {
            return res.status(400).json({ message: 'You are not in a family' });
        }

        const events = await CalendarEvent.find({
            familyId: req.familyId,
            isPersonal: false
        })
            .populate('createdBy attendees', 'name email')
            .sort({ startDateTime: 1 });

        res.json(events);
    } catch (error) {
        console.error('Get family events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get events for specific month
exports.getEventsByMonth = async (req, res) => {
    try {
        const { year, month } = req.params;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const events = await CalendarEvent.find({
            familyId: req.familyId,
            $or: [
                { isPersonal: false },
                { createdBy: req.userId, isPersonal: true }
            ],
            startDateTime: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('createdBy attendees', 'name email')
            .sort({ startDateTime: 1 });

        res.json(events);
    } catch (error) {
        console.error('Get events by month error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update calendar event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await CalendarEvent.findOne({
            _id: id,
            familyId: req.familyId
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only creator can update personal events
        if (event.isPersonal && !event.createdBy.equals(req.userId)) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        Object.keys(updates).forEach(key => {
            event[key] = updates[key];
        });

        await event.save();
        await event.populate('createdBy attendees', 'name email');

        res.json(event);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete calendar event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await CalendarEvent.findOne({
            _id: id,
            familyId: req.familyId
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only creator can delete personal events
        if (event.isPersonal && !event.createdBy.equals(req.userId)) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
