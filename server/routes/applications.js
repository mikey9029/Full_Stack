const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Application = require('../models/Application');
const { sendStatusNotification } = require('../services/emailService');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { cloudinary } = require('../services/uploadService');

const router = express.Router();

/**
 * @desc    Get current user applications
 * @route   GET /api/applications/student
 * @access  Private/Student
 */
router.get('/student', protect, async (req, res) => {
    try {
        const apps = await Application.find({ student: req.user.id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            })
            .sort({ appliedAt: -1 })
            .lean();

        // Generate signed URLs for student view if needed, but usually admin is the priority
        apps.forEach(app => {
            if (app.student?.resumePublicId) {
                app.student.resumeUrl = cloudinary.url(app.student.resumePublicId, {
                    sign_url: true,
                    secure: true,
                    resource_type: 'raw'
                });
            }
        });

        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Get all applications (Full Overview)
 * @route   GET /api/applications/admin
 * @access  Private/Admin
 */
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const apps = await Application.find()
            .populate('student', 'firstName lastName email phone resumeUrl resumePublicId')
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            })
            .sort({ appliedAt: -1 })
            .lean();

        // Generate signed URLs for each candidate's resume
        apps.forEach(app => {
            if (app.student?.resumePublicId) {
                app.student.resumeUrl = cloudinary.url(app.student.resumePublicId, {
                    sign_url: true,
                    secure: true,
                    resource_type: 'raw'
                });
            }
        });

        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Update application status & schedule interview
 * @route   PATCH /api/applications/:id/status
 * @access  Private/Admin/Company
 */
router.patch('/:id/status', protect, async (req, res) => {
    try {
        const { status, interviewTime, feedback } = req.body;
        
        let application = await Application.findById(req.params.id).populate('student').populate({
            path: 'job',
            populate: { path: 'company', select: 'name' }
        });
        
        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        application.status = status || application.status;
        application.interviewTime = interviewTime || application.interviewTime;
        application.feedback = feedback || application.feedback;

        await application.save();

        // Send Notification Email (Using premium Brevo template)
        try {
            await sendStatusNotification(application.student, application.job.title, application.status, application.interviewTime);
        } catch (emailErr) {
            console.error('Status email failed:', emailErr.message);
        }

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Student updates preferred time wish
 * @route   PATCH /api/applications/:id/wish
 * @access  Private/Student
 */
router.patch('/:id/wish', protect, async (req, res) => {
    try {
        const { studentPreferredTime } = req.body;
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, student: req.user.id },
            { studentPreferredTime },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found or unauthorized' });
        }

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
