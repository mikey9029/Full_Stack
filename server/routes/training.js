const express = require('express');
const Training = require('../models/Training');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Get all training courses
 * @route   GET /api/training
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Training.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Add a training course
 * @route   POST /api/training
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const course = await Training.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
