const express = require('express');
const router = express.Router();
const { getCompanies } = require('../services/companyService');

// @route   GET /api/companies
// @desc    Get top rated companies and their profiles
// @access  Public
router.get('/', getCompanies);

module.exports = router;
