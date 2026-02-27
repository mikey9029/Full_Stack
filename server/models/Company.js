const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true
    },
    type: {
        type: String,
        default: 'Other'
    },
    rating: Number,
    reviews: String,
    tags: [String],
    address: String,
    phone: String,
    website: String,
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    // Reference to the user who manages this company (if any)
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', CompanySchema);
