const Job = require('../models/Job');
const Application = require('../models/Application');
const { sendEmail } = require('./emailService');
const User = require('../models/User');

/**
 * @desc    Get all jobs with company info
 * @returns {Array} List of jobs
 */
const getAllJobs = async (filters = {}, user = null) => {
    let query = { ...filters };

    // We no longer strictly filter by CGPA here so students can see all roles
    // Eligibility gates are enforced upon application on the frontend/backend.
    return await Job.find(query).populate('company', 'name type website');
};

/**
 * @desc    Create a new job posting
 * @param   {Object} jobData
 * @returns {Object} Created job
 */
const createJob = async (jobData) => {
    return await Job.create(jobData);
};

/**
 * @desc    Apply for a job
 * @param   {string} studentId
 * @param   {string} jobId
 * @returns {Object} Created application
 */
const applyForJob = async (studentId, jobId) => {
    // Check if job exists and is open
    const job = await Job.findById(jobId).populate('company', 'name');
    if (!job || job.status !== 'Open') {
        throw new Error('Job not found or is no longer accepting applications');
    }

    const student = await User.findById(studentId);
    if (!student) {
        throw new Error('Student profile not found');
    }

    // Eligibility Enforcement
    if (student.role === 'student') {
        const studentCgpa = parseFloat(student.cgpaBTech) || 0;
        const requiredCgpa = parseFloat(job.minCgpa) || 0;
        if (studentCgpa < requiredCgpa) {
            throw new Error(`Ineligible: Your CGPA (${studentCgpa}) does not meet the minimum requirement (${requiredCgpa}) for this role.`);
        }
    }

    // Check application exists
    const existingApplication = await Application.findOne({ student: studentId, job: jobId });
    if (existingApplication) {
        throw new Error('You have already applied for this job');
    }

    const application = await Application.create({
        student: studentId,
        job: jobId
    });

    // Send confirmation email
    try {
        const student = await User.findById(studentId);
        const studentFullName = student.firstName ? `${student.firstName} ${student.lastName}` : (student.name || 'Student');
        const subject = `Application Received: ${job.title}`;
        const content = `
            <h3>Hello ${studentFullName},</h3>
            <p>Your application for <strong>${job.title}</strong> at <strong>${job.company?.name}</strong> has been successfully received.</p>
            <p>We will review your profile and update you on the next steps shortly.</p>
            <br/>
            <p>Best Regards,</p>
            <p><strong>PlacementHead</strong></p>
            <p>PlacePro Management System</p>
        `;
        await sendEmail(student.email, subject, content, true);
    } catch (emailErr) {
        console.error('Email notification failed:', emailErr.message);
        // We don't throw here to avoid failing the application if only the email fails
    }

    return application;
};

/**
 * @desc    Get applications for a job (for admins/companies)
 * @param   {string} jobId
 * @returns {Array} List of applications
 */
const getJobApplications = async (jobId) => {
    return await Application.find({ job: jobId }).populate('student', 'name email phone');
};

/**
 * @desc    Update an existing job
 * @param   {string} id
 * @param   {Object} jobData
 * @returns {Object} Updated job
 */
const updateJob = async (id, jobData) => {
    return await Job.findByIdAndUpdate(id, jobData, { new: true, runValidators: true });
};

/**
 * @desc    Delete a job
 * @param   {string} id
 * @returns {Object} Deleted job
 */
const deleteJob = async (id) => {
    // Optionally delete associated applications if needed
    // await Application.deleteMany({ job: id });
    return await Job.findByIdAndDelete(id);
};

module.exports = {
    getAllJobs,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    getJobApplications
};
