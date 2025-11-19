const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create calendar event
router.post('/events', calendarController.createEvent);

// Get personal calendar events
router.get('/personal', calendarController.getPersonalEvents);

// Get family calendar events
router.get('/family', calendarController.getFamilyEvents);

// Get events for specific month
router.get('/month/:year/:month', calendarController.getEventsByMonth);

// Update event
router.put('/events/:id', calendarController.updateEvent);

// Delete event
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router;
