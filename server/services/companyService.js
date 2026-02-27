const Company = require('../models/Company');

const getCompanies = async (req, res) => {
    try {
        // Find all active companies and sort them by rating (descending)
        const companies = await Company.find({}).sort({ rating: -1 });
        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    getCompanies
};
