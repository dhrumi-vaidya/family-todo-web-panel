const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    startDateTime: {
        type: Date,
        required: [true, 'Start date/time is required']
    },
    endDateTime: {
        type: Date,
        required: [true, 'End date/time is required']
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    color: {
        type: String,
        default: '#3788d8'
    },
    isPersonal: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
calendarEventSchema.index({ familyId: 1, startDateTime: 1 });
calendarEventSchema.index({ createdBy: 1, isPersonal: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
