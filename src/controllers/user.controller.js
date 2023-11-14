// controllers/userController.js
import User from '../models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* import app config */
import config from '../config';

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
        res.status(201).json({ token, user: { _id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ Username: username });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

        // Respond with the token and user details
        res.json({ token, user: { _id: user._id, username: user.Username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    loginUser,
    registerUser
}