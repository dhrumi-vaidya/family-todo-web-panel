const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Bill title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        enum: ['utilities', 'rent', 'groceries', 'insurance', 'subscription', 'other'],
        default: 'other'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPeriod: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly', 'none'],
        default: 'none'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true
    },
    attachment: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
    }
}, {
    timestamps: true
});

// Index for efficient queries
billSchema.index({ familyId: 1, dueDate: 1 });
billSchema.index({ assignedTo: 1, isPaid: 1 });

module.exports = mongoose.model('Bill', billSchema);
