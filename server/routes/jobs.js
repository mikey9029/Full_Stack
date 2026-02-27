const express = require('express');
const { getJobs, postJob, applyJob, getApplications, patchJob, removeJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getJobs)
    .post(protect, authorize('admin', 'company'), postJob);

router.route('/:id')
    .patch(protect, authorize('admin', 'company'), patchJob)
    .delete(protect, authorize('admin', 'company'), removeJob);

router.route('/:id/apply')
    .post(protect, authorize('student'), applyJob);

router.route('/:id/applications')
    .get(protect, authorize('admin', 'company'), getApplications);

module.exports = router;
