import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from "dotenv"

import errorHandler from './middleware/errorHandler.js';
import fourOhFour from './middleware/fourOhFour.js';
import root from './routes/root.routes.js';
import usersRoutes from './routes/user.routes.js';
import mooviesRoutes from './routes/movie.routes.js';
import { passport } from "./middleware/passportAuthMiddleware.js"

const app = express()

// Apply most middleware first
dotenv.config()
console.log(process.env["TMDB_API_KEY"]);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env['ORIGIN']
}))
app.use(helmet())
app.use(morgan('dev')) //tiny

// Initialize Passport
app.use(passport.initialize());

// Apply routes before error handling
app.use('/api/v1', root)
app.use('/api/v1/users', usersRoutes);

app.use("/api/v1/flixflex", mooviesRoutes)


// Apply error handling last
app.use(fourOhFour)
app.use(errorHandler)

export default app