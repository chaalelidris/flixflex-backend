import axios from 'axios';
import Favorite from '../models/favorite-model';
import config from '../config';

const addToFavorites = async (req, res) => {
    try {
        const { user } = req;
        const { itemId, itemType } = req.body;

        // Check if the movie/series already exists in favorites
        const existingFavorite = await Favorite.findOne({ userId: user._id, itemId });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Already in favorites' });
        }

        // Check if movie/series exists on TMDB
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${itemType}/${itemId}`, {
            params: { api_key: config.tmdbApiKey },
        });
        if (!tmdbResponse.data) {
            return res.status(404).json({ error: `${itemType} not found on TMDB` });
        }

        // Add to favorites
        const favorite = new Favorite({ userId: user._id, itemId, itemType });
        await favorite.save();
        res.status(201).json({ message: 'Added to favorites successfully' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const { user } = req;
        const { favoriteId } = req.params;

        // Check if the favorite item exists
        const existingFavorite = await Favorite.findOneAndDelete({ userId: user._id, _id: favoriteId });
        if (!existingFavorite) {
            return res.status(404).json({ error: 'Favorite item not found' });
        }

        res.json({ message: 'Removed from favorites successfully' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFavorites = async (req, res) => {
    try {
        const { user } = req;

        // Get favorite items
        const favorites = await Favorite.find({ userId: user._id });

        res.json(favorites);
    } catch (error) {
        console.error('Error getting favorite items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addToFavorites, getFavorites, removeFromFavorites };