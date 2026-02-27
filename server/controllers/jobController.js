const { getAllJobs, createJob, updateJob, deleteJob, applyForJob, getJobApplications } = require('../services/jobService');

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 * @access  Private
 */
exports.getJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Create job
 * @route   POST /api/jobs
 * @access  Private/Admin/Company
 */
exports.postJob = async (req, res) => {
    try {
        // Add company/owner from logged in user
        req.body.owner = req.user.id;
        
        const job = await createJob(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Apply for job
 * @route   POST /api/jobs/:id/apply
 * @access  Private/Student
 */
exports.applyJob = async (req, res) => {
    try {
        const application = await applyForJob(req.user.id, req.params.id);
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get applications for a job
 * @route   GET /api/jobs/:id/applications
 * @access  Private/Admin/Company
 */
exports.getApplications = async (req, res) => {
    try {
        const applications = await getJobApplications(req.params.id);
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Update job
 * @route   PATCH /api/jobs/:id
 * @access  Private/Admin/Company
 */
exports.patchJob = async (req, res) => {
    try {
        const job = await updateJob(req.params.id, req.body);
        res.status(200).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id
 * @access  Private/Admin/Company
 */
exports.removeJob = async (req, res) => {
    try {
        await deleteJob(req.params.id);
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
