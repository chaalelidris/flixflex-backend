import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import config from '../config';
import User from '../models/user-model';
import bcrypt from 'bcrypt';

// Passport Local Strategy For login
const LocalStrategy = passportLocal.Strategy;
passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = await User.findOne({ username }); //find a user by username

        if (!user) {
            return done(null, false, { message: 'Incorrect credentials' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password); //Check if the provided password matches the stored hashed password

        if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect credentials' });
        }

        return done(null, user); // If authentication succeeds, return the user object
    })
);

// Passport JWT Strategy
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
};
passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        const user = await User.findById(jwtPayload.userId); //find a user by ID

        if (!user) {
            return done(null, false);
        }

        return done(null, user); // If the user is found, return the user object
    })
);

export {
    passport
}