const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    totalBudget: {
        type: Number,
        required: [true, 'Total budget is required'],
        min: 0
    },
    categories: [{
        name: {
            type: String,
            required: true
        },
        allocated: {
            type: Number,
            required: true,
            min: 0
        },
        spent: {
            type: Number,
            default: 0,
            min: 0
        }
    }],
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
budgetSchema.index({ familyId: 1, year: 1, month: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
