// controllers/userController.js
import User from '../models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* import app config */
import config from '../config';
import passport from 'passport';

const saltRounds = 10;

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for null or undefined username
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = await User.create({ username, password: hashedPassword });

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, { expiresIn: '24h' });

        // Respond with the token and user details
        res.status(201).json({ token, user: { _id: newUser._id, username: newUser.username }, message: "Registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginUser = (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
        try {

            if (error || !user) {
                return res.status(401).json({
                    message: info.message,
                    user: user
                });
            }
            // Generate a JWT token
            const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

            res.json({ token, user, message: "Logged in successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })(req, res);
};

export {
    loginUser,
    registerUser
}