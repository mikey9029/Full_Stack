const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

/**
 * @desc    Register a new user
 * @param   {Object} userData
 * @returns {Object} { user, token }
 */
const registerUser = async (userData) => {
    const { 
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        role, 
        phone,
        percentage10th,
        percentageIntermediate,
        cgpaBTech
    } = userData;

    // Check if user exists (email or username)
    const userExists = await User.findOne({ 
        $or: [{ email }, { username }]
    });
    
    if (userExists) {
        throw new Error('User already exists with this email or username');
    }

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        phone,
        percentage10th,
        percentageIntermediate,
        cgpaBTech
    });

    const token = user.getSignedJwtToken();

    return { user, token };
};

/**
 * @desc    Login user
 * @param   {string} identifier (Email or Username)
 * @param   {string} password
 * @returns {Object} { user, token }
 */
const loginUser = async (identifier, password) => {
    // Check for user by email or username
    const user = await User.findOne({ 
        $or: [
            { email: identifier },
            { username: identifier }
        ]
    }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = user.getSignedJwtToken();

    return { user, token };
};

module.exports = {
    registerUser,
    loginUser
};
