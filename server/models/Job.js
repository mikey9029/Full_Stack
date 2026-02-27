const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title']
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    description: String,
    role: String,
    salary: String,
    location: String,
    minPercentage: {
        type: Number,
        default: 0
    },
    minCgpa: {
        type: Number,
        default: 0
    },
    skills: [String],
    deadline: Date,
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
