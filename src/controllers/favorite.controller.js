import axios from 'axios';
import Favorite from '../models/favorite-model.js';


const addToFavorites = async (req, res) => {
    try {
        const { user } = req;
        const { itemId, itemType } = req.body;
        const tmdbApiKey = process.env.TMDB_API_KEY;

        const validItemTypes = ["movie", "tv"];
        if (!validItemTypes.includes(itemType)) {
            return res.status(400).json({ success: false, error: 'Invalid itemType; must be movie or tv' });
        }

        // Check if the movie/series already exists in favorites
        const existingFavorite = await Favorite.findOne({ userId: user._id, itemId });
        if (existingFavorite) {
            return res.status(400).json({ success: false, error: 'Already in favorites' });
        }

        // Check if movie/series exists on TMDB
        try {
            await axios.get(`https://api.themoviedb.org/3/${itemType}/${itemId}`, {
                params: { api_key: tmdbApiKey },
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ success: false, error: 'Item not found on TMDB' });
            }
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        // Add to favorites
        const favorite = new Favorite({ userId: user._id, itemId, itemType });
        await favorite.save();

        res.status(201).json({ success: true, message: 'Added to favorites successfully' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



const removeFromFavorites = async (req, res) => {
    try {
        const { user } = req;
        const { favoriteId } = req.params;

        // Check if the favorite item exists
        const existingFavorite = await Favorite.findOneAndDelete({ userId: user._id, _id: favoriteId });
        if (!existingFavorite) {
            return res.status(404).json({ success: false, error: 'Favorite item not found' });
        }

        res.json({ success: true, message: 'Removed from favorites successfully' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


const getFavorites = async (req, res) => {
    try {
        const { user } = req;

        // Get favorite items
        const favorites = await Favorite.find({ userId: user._id });

        res.status(200).json({ success: true, data: favorites });
    } catch (error) {
        console.error('Error getting favorite items:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


export { addToFavorites, getFavorites, removeFromFavorites };
