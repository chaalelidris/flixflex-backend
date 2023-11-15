import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config';
import errorHandler from './middleware/errorHandler';
import fourOhFour from './middleware/fourOhFour';
import root from './routes/root.routes';
import userRoutes from './routes/user.routes';

const app = express()

// Apply most middleware first
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
    origin: config.clientOrigins[config.nodeEnv]
}))

app.use(helmet())
app.use(morgan('dev')) //tiny

// Initialize Passport
import { passport } from "./middleware/passportAuthMiddleware"
app.use(passport.initialize());

// Apply routes before error handling
app.use('/', root)
app.use('/api/v1/users', userRoutes);

// Apply error handling last
app.use(fourOhFour)
app.use(errorHandler)

export default app