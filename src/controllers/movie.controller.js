import axios from 'axios';
import { handleApiError } from '../utils/apiHelpers';


const getMovies = async (req, res) => {
    const { page, batch10 } = req.query;

    try {
        let pageNumber = Math.max(parseInt(page), 1);
        let startIndex = 0;

        if (page && batch10 === "true") {
            startIndex = page % 2 === 0 ? 10 : 0;
            pageNumber = Math.ceil(pageNumber / 2);
        }

        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: pageNumber || 1,
                sort_by: 'popularity.desc',
                api_key: process.env.TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
            },
        });

        let paginatedMovies;
        if (page && batch10 && batch10 === "true") {
            paginatedMovies = {
                page,
                results: response.data.results.slice(startIndex, startIndex + 10),
                total_pages: response.data.total_pages * 2,
                total_results: response.data.total_results
            }
        } else {
            paginatedMovies = response.data;
        }

        res.json({ success: true, data: paginatedMovies });
    } catch (error) {
        handleApiError(res, 'getMovies', error);
    }
};

const getSeries = async (req, res) => {
    const { page, batch10 } = req.query;

    try {
        let pageNumber = Math.max(parseInt(page), 1);
        let startIndex = 0;

        if (page && batch10 === "true") {
            startIndex = page % 2 === 0 ? 10 : 0;
            pageNumber = Math.ceil(pageNumber / 2);
        }

        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: pageNumber || 1,
                sort_by: 'popularity.desc',
                api_key: process.env.TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
            },
        });

        let paginatedSeries;
        if (page && batch10 && batch10 === "true") {
            paginatedSeries = {
                page,
                results: response.data.results.slice(startIndex, startIndex + 10),
                total_pages: response.data.total_pages * 2,
                total_results: response.data.total_results
            };
        } else {
            paginatedSeries = response.data;
        }

        res.status(200).json({ success: true, data: paginatedSeries });
    } catch (error) {
        handleApiError(res, 'getSeries', error);
    }
};

const getTopMovies = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1, // Use the requested page or default to 1
                api_key: process.env.TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ success: false, error: 'Invalid response from TMDB API' });
        }

        // Extract the top 5 movies
        const topMovies = response.data.results.slice(0, 5);

        res.json({ success: true, data: topMovies });
    } catch (error) {
        handleApiError(res, 'getTopMovies', error);
    }
};

const getTopSeries = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1,
                api_key: process.env.TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ success: false, error: 'Invalid response from TMDB API' });
        }

        // Extract the top 5 series
        const topSeries = response.data.results.slice(0, 5);

        res.json({ success: true, data: topSeries });
    } catch (error) {
        handleApiError(res, 'getTopSeries', error);
    }
};

const searchMoviesAndSeries = async (req, res) => {
    const { query, page } = req.query;
    try {

        // Call TMDB API for search
        const searchMulti = await axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                page,
                query,
            },
        });

        // Extract relevant data from the TMDB response
        const results = searchMulti.data && searchMulti.data;

        res.json({ success: true, data: results });
    } catch (error) {
        handleApiError(res, 'searchMoviesAndSeries', error);

    }
};

const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Call TMDB API for details
        const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            },
        });


        res.json({ success: true, data: movieDetails.data });
    } catch (error) {
        handleApiError(res, 'getMovieDetails', error);
    }
};

const getSerieDetails = async (req, res) => {
    try {
        const { serieId } = req.params;

        // Call TMDB API for details
        const serieDetails = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            },
        });

        res.json({ success: true, data: serieDetails.data });
    } catch (error) {
        handleApiError(res, 'getSerieDetails', error);
    }
};

const getMovieTrailer = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Call TMDB API for videos
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            },
        });

        // Find the first trailer key, assuming it's a YouTube video
        const trailer = tmdbResponse.data.results.find(video => video.type === 'Trailer');

        if (!trailer) {
            return res.status(404).json({ success: false, error: 'Trailer not found' });
        }

        // Construct the YouTube embed URL
        const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

        res.json({ success: true, data: trailerUrl });
    } catch (error) {
        handleApiError(res, 'getMovieTrailer', error);
    }
};

const getSerieTrailer = async (req, res) => {
    try {
        const { serieId } = req.params;

        // Call TMDB API for videos
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            },
        });

        // Find the first trailer key, assuming it's a YouTube video
        const trailerKey = tmdbResponse.data && tmdbResponse.data.results.find(video => video.type === 'Trailer')?.key;

        if (!trailerKey) {
            return res.status(404).json({ success: false, error: 'Trailer not found' });
        }

        // Construct the YouTube embed URL
        const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

        res.json({ success: true, data: trailerUrl });
    } catch (error) {
        handleApiError(res, 'getSerieTrailer', error);
    }
};



export { getMovies, getSeries, getTopMovies, getTopSeries, searchMoviesAndSeries, getSerieDetails, getMovieDetails, getMovieTrailer, getSerieTrailer };
