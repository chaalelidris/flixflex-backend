import axios from 'axios';
import config from '../config';

const getMovies = async (req, res) => {
    const { page, batch10 } = req.query;

    try {
        let pageNumber;
        let startIndex;
        if (batch10 && batch10 == true) {
            if (page % 2 === 0) {
                pageNumber = page / 2;
                startIndex = 0;
            } else {
                pageNumber = Math.ceil(page / 2);
                startIndex = 10;
            }
        }
        // Validate page and batchSize
        pageNumber = Math.max(parseInt(page), 1);
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: pageNumber || 1,
                sort_by: 'popularity.desc',
                api_key: config.tmdbApiKey,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ error: 'Invalid response from TMDB API' });
        }

        // Extract the relevant movies based on the offset and pageSize
        const paginatedMovies = response.data.results.slice(startIndex, startIndex + 10);

        res.json(paginatedMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSeries = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
            params: {
                include_adult: false,
                include_null_first_air_dates: false,
                language: 'en-US',
                page: page || 1, // Use the requested page or default to 1
                sort_by: 'popularity.desc',
                api_key: config.tmdbApiKey,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const series = response.data.results;
        res.json(series);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTopMovies = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1, // Use the requested page or default to 1
                api_key: config.tmdbApiKey,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ error: 'Invalid response from TMDB API' });
        }

        // Extract the top 5 movies
        const topMovies = response.data.results.slice(0, 5);

        res.json(topMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTopSeries = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1,
                api_key: config.tmdbApiKey,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ error: 'Invalid response from TMDB API' });
        }

        // Extract the top 5 series
        const topSeries = response.data.results.slice(0, 5);

        res.json(topSeries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const searchMoviesAndSeries = async (req, res) => {
    try {
        const { query } = req.params;

        // Call TMDB API for search
        const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
                api_key: config.tmdbApiKey,
                query,
            },
        });

        // Extract relevant data from the TMDB response
        const results = tmdbResponse.data.results.map(result => ({
            id: result.id,
            title: result.title || result.name,
            type: result.media_type,
        }));

        res.json(results);
    } catch (error) {
        console.error('Error searching movies and series:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Call TMDB API for details
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movies/${movieId}`, {
            params: {
                api_key: config.tmdbApiKey,
            },
        });


        res.json(tmdbResponse.data);
    } catch (error) {
        console.error('Error getting details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getSerieDetails = async (req, res) => {
    try {
        const { serieId } = req.params;

        // Call TMDB API for details
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
            params: {
                api_key: config.tmdbApiKey,
            },
        });



        res.json(tmdbResponse.data);
    } catch (error) {
        console.error('Error getting details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTrailer = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;

        // Call TMDB API for videos
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${itemType}/${itemId}/videos`, {
            params: {
                api_key: config.tmdbApiKey,
            },
        });

        // Find the first trailer key, assuming it's a YouTube video
        const trailerKey = tmdbResponse.data.results.find(video => video.type === 'Trailer')?.key;

        if (!trailerKey) {
            return res.status(404).json({ error: 'Trailer not found' });
        }

        // Construct the YouTube embed URL
        const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

        res.json({ trailerUrl });
    } catch (error) {
        console.error('Error getting trailer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export { getMovies, getSeries, getTopMovies, getTopSeries, searchMoviesAndSeries, getSerieDetails, getMovieDetails, getTrailer };
