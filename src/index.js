import app from './app.js';
import connectDB from "./db/connect.js"

try {
    connectDB(process.env.MONGODB_URI);
    app.listen(process.env['PORT'] ?? 3000, () => {
        console.log(`🚀 Listening on ${process.env['PORT'] ?? 3000} with NODE_ENV=${process.env['NODE_ENV'] ?? 'development'} 🚀 at http://localhost:${process.env['PORT'] ?? 3000}`)
    })
} catch (error) {
    console.log(error);
}