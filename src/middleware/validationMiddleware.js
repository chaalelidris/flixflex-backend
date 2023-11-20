import { body, validationResult } from 'express-validator';

const usernameFormatRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordFormatRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

const usernameValidationMessage = 'Username must be between 3 and 20 characters long, and can only contain letters, numbers, and underscores.';
const passwordValidationMessage = 'Password must be at least 8 characters long and include at least one letter and one digit.';

const authValidationRules = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .matches(usernameFormatRegex).withMessage(usernameValidationMessage)
        .escape(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .matches(passwordFormatRegex).withMessage(passwordValidationMessage)
        .escape(),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array().map(error => error.msg) });
    }
    next();
};

export { authValidationRules, validate };
