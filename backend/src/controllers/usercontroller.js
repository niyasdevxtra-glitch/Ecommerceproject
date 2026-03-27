const User = require('../models/user_model');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(409).json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        res.status(201).json({
            success: true,
            message: "Registered successfully!",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields required!' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found!' });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect password!' });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ success: false, message: 'Your account is disabled by admin!' });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        return res.status(200).json({
            success: true,
            message: 'Welcome',
            username: user.username,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
};

exports.userupdate = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { username, email, password } = req.body;

        if (!username && !email && !password) {
            return res.status(400).json({ success: false, message: 'Nothing to update!' });
        }

        const updatedData = {};

        if (username) updatedData.username = username;
        if (email) updatedData.email = email;

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const data = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!data) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Data updated successfully!' });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ success: true, message: "Logged out successfully!" });
    });
};
