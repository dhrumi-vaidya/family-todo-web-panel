const mongoose = require('mongoose');
const crypto = require('crypto');

const familySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Family name is required'],
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteCode: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate invite code before saving
familySchema.pre('save', function (next) {
    if (!this.inviteCode) {
        this.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Family', familySchema);
