import app from './app'
import config from './config'
import connectDB from "./db/connect"

try {
    connectDB(process.env.MONGODB_URI);
    app.listen(config.port, () => {
        console.log(`🚀 ${config.name} ${config.version} 🚀`)
        console.log(`🚀 Listening on ${config.port} with NODE_ENV=${config.nodeEnv} 🚀 at http://localhost:${config.port}`)
    })
} catch (error) {
    console.log(error);
}