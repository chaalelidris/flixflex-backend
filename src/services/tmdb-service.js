const axios = require('axios');
const { default: config } = require('../config');


async function getMovieDetails(movieId) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}`;
        const response = await axios.get(url, {
            params: {
                language: 'en-US',
                api_key: config.tmdbApiKey,
            },
            headers: {
                accept: 'application/json',
            },
        });
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

module.exports = { getMovieDetails };
