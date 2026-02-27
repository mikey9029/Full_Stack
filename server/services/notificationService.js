const Notification = require('../models/Notification');

/**
 * @desc    Get feed for a specific role
 * @param   {string} role
 * @returns {Array} List of notifications
 */
const getFeed = async (role) => {
    return await Notification.find({
        $or: [{ targetRole: role }, { targetRole: 'all' }]
    }).sort({ createdAt: -1 });
};

/**
 * @desc    Post a new notification
 * @param   {Object} notificationData
 * @returns {Object} Created notification
 */
const postNotification = async (notificationData) => {
    return await Notification.create(notificationData);
};

module.exports = {
    getFeed,
    postNotification
};
