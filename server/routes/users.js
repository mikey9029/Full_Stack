const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { upload, cloudinary } = require('../services/uploadService');
const emailService = require('../services/emailService');
const User = require('../models/User');

const router = express.Router();

/**
 * @desc    Get all students
 * @route   GET /api/users/students
 * @access  Private/Admin
 */
router.get('/students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
        
        // Sign URLs for all students in the management view
        students.forEach(student => {
            if (student.resumePublicId) {
                student.resumeUrl = cloudinary.url(student.resumePublicId, {
                    sign_url: true,
                    secure: true,
                    resource_type: 'raw'
                });
            }
        });

        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).lean();
        
        // Generate signed URL if resume exists
        if (user.resumePublicId) {
            user.resumeUrl = cloudinary.url(user.resumePublicId, {
                sign_url: true,
                secure: true,
                resource_type: 'raw'
            });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Upload resume
 * @route   POST /api/users/profile/resume
 * @access  Private
 */
router.post('/profile/resume', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                resumeUrl: req.file.path,
                resumePublicId: req.file.filename
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Delete student
 * @route   DELETE /api/users/students/:id
 * @access  Private/Admin
 */
router.delete('/students/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        if (student.role !== 'student') {
            return res.status(400).json({ success: false, error: 'Only student accounts can be deleted via this route' });
        }
        
        await student.deleteOne();
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Toggle student verification status
 * @route   PATCH /api/users/students/:id/verify
 * @access  Private/Admin
 */
router.patch('/students/:id/verify', protect, authorize('admin'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        student.isVerified = !student.isVerified;
        await student.save();
        
        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc    Send contact email to student via Brevo
 * @route   POST /api/users/students/:id/contact
 * @access  Private/Admin
 */
router.post('/students/:id/contact', protect, authorize('admin'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        const subject = "Placement Team - Application Inquiry";
        const content = `Hi ${student.firstName}, the Placement Team wants to contact you regarding the applications you have to send. Please get in touch with us at the earliest.`;

        const sent = await emailService.sendEmail(student.email, subject, content);

        if (sent) {
            res.status(200).json({ success: true, message: 'Email sent successfully via Brevo' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to send email via Brevo' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
