import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

const User = mongoose.model('User', userSchema);

export default User
