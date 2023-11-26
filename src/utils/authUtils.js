import jwt from 'jsonwebtoken';

const generateJwtToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || "1234-1234-1234-1234",
        { expiresIn: '24h' }
    );
};

export { generateJwtToken };
