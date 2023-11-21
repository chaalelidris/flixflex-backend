// controllers/userController.js
import bcrypt from 'bcrypt';
import passport from 'passport';

import User from '../models/user-model.js';
import { matchedData } from 'express-validator';
import { generateJwtToken } from '../services/authService.js';

const saltRounds = 10;

const registerUser = async (req, res) => {
    const { username, password } = matchedData(req);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        const newUser = await User.create({ username, password: hashedPassword }); // Create a new user


        const token = generateJwtToken(newUser); // Generate a JWT token

        // Respond with the token and user details
        res.status(201).json({ success: true, message: "Successful user registration", token, user: { _id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error('User registration error:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


const loginUser = (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error) {
            console.error('Passport authentication error:', error);
            return res.status(401).json({ success: false, error: 'Internal Server Error' });
        }

        if (!user) {
            const errorMessage = info && info.message ? info.message : 'Authentication failed';
            return res.status(401).json({ success: false, error: errorMessage });
        }

        try {
            const token = generateJwtToken(user);
            const responseData = { success: true, message: "Successful user login", token, user: { _id: user._id, username: user.username } };
            res.json(responseData);
        } catch (error) {
            console.error('User login error:', error);
            return res.status(401).json({ success: false, error: 'Internal Server Error' });
        }
    })(req, res);
};


export {
    loginUser,
    registerUser
}