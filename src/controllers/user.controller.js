// controllers/userController.js
import User from '../models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const saltRounds = 10;

export const registerUser = async (req, res) => {
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
        res.status(201).json({ token, user: { _id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
