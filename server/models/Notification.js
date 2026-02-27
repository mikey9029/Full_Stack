const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    type: {
        type: String,
        enum: ['General', 'Job Alert', 'Selection', 'Reminder'],
        default: 'General'
    },
    targetRole: {
        type: String,
        enum: ['student', 'admin', 'company', 'all'],
        default: 'all'
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
