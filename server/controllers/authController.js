const { registerUser, loginUser } = require('../services/authService');

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const result = await loginUser(email, password);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            error: err.message
        });
    }
};
