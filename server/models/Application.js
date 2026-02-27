const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Accepted', 'Rejected', 'Interview'],
        default: 'Applied'
    },
    interviewTime: Date,
    studentPreferredTime: String,
    feedback: String,
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// Avoid duplicate applications
ApplicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
