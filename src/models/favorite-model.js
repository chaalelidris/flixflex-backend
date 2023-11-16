import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    itemType: {
        type: String,
        enum: ['movie', 'series'],
        required: true,
    },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
