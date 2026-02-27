const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Please add a course name']
    },
    lecturer: {
        type: String,
        required: [true, 'Please add a lecturer name']
    },
    description: String,
    duration: String,
    status: {
        type: String,
        enum: ['Active', 'Completed'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Training', TrainingSchema);
