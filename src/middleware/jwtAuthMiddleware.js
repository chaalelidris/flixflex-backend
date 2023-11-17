
import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    let token = req.headers.authorization;
    // Check if the token is present
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    token = token.split(" ")[1];

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env['JWT_SECRET'] ?? "1234-1234-1234-1234");

        // Attach the decoded user information to the request object
        req.user = decodedToken;

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

export { authMiddleware };
