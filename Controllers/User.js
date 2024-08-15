const User = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const { password, ...rest } = req.body;
    try {
        const existingUser = await User.findOne({ email: rest.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            ...rest,
            password: hashedPassword,
        });

        const doc = await user.save();
        res.status(201).json({ user: doc });
    } catch (err) {
        console.error('Create user error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.fetchUserByEmail = async (req, res) => {
    const { email } = req.body; 
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(200).json({ exists: true, user });
        } else {
            res.status(404).json({ exists: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Fetch user by email error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.editUser = async (req, res) => {
    const { email } = req.params;
    const { currPassword, ...changes } = req.body;

    try {
        const user = await User.findOne({ email :email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currPassword) {
            const isMatch = await bcrypt.compare(currPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            if (changes.password) {
                changes.password = await bcrypt.hash(changes.password, 10);
            }
        }

        Object.assign(user, changes);
        await user.save();

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT error:', err.message);
                    res.status(500).json({ message: 'Failed to generate token' });
                } else {
                    res.status(200).json({ token:user._id, message: 'Login successful', user });
                }
            }
        );
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};