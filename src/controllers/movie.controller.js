import axios from 'axios';


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
                api_key: process.env["TMDB_API_KEY"],
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

        res.json(paginatedMovies);
    } catch (error) {
        if (error.response) {
            console.error('TMDB API Error | getMovies:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API | getMovies');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error during TMDB API request setup | getMovies:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
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
                api_key: process.env["TMDB_API_KEY"],
            },
            headers: {
                accept: 'application/json',
            },
        });

        // Check if the response exists
        if (!response || !response.data) {
            return res.status(500).json({ error: 'Invalid response from TMDB API' });
        }

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

        res.json(paginatedMovies);
    } catch (error) {
        if (error.response) {
            console.error('TMDB API Error | getSeries:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API | getSeries');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error during TMDB API request setup | getSeries:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getTopMovies = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1, // Use the requested page or default to 1
                api_key: process.env["TMDB_API_KEY"],
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
        if (error.response) {
            console.error('TMDB API Error | getTopMovies:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API | getTopMovies');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error during TMDB API request setup | getTopMovies:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getTopSeries = async (req, res) => {
    const { page } = req.query;

    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                language: 'en-US',
                page: page || 1,
                api_key: process.env["TMDB_API_KEY"],
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
        if (error.response) {
            console.error('TMDB API Error | getTopSeries:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API | getTopSeries');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error getTopSeries:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const searchMoviesAndSeries = async (req, res) => {
    const { query } = req.query;
    try {

        // Call TMDB API for search
        const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
                api_key: process.env["TMDB_API_KEY"],
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
        if (error.response) {
            console.error('TMDB API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error searchMoviesAndSeries:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Call TMDB API for details
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: process.env["TMDB_API_KEY"],
            },
        });


        res.json(tmdbResponse.data);
    } catch (error) {
        if (error.response) {
            console.error('TMDB API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error getMovieDetails:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getSerieDetails = async (req, res) => {
    try {
        const { serieId } = req.params;

        // Call TMDB API for details
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
            params: {
                api_key: process.env["TMDB_API_KEY"],
            },
        });

        res.json(tmdbResponse.data);
    } catch (error) {
        if (error.response) {
            console.error('TMDB API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error getSerieDetails:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getMovieTrailer = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Call TMDB API for videos
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            params: {
                api_key: process.env["TMDB_API_KEY"],
            },
        });

        if (!tmdbResponse.data || !tmdbResponse.data.results) {
            throw new Error('Invalid response from TMDB API');
        }

        // Find the first trailer key, assuming it's a YouTube video
        const trailerKey = tmdbResponse.data.results.find(video => video.type === 'Trailer')?.key;

        if (!trailerKey) {
            return res.status(404).json({ error: 'Trailer not found' });
        }

        // Construct the YouTube embed URL
        const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

        res.json({ trailerUrl });
    } catch (error) {
        if (error.response) {
            console.error('TMDB API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error during TMDB API request setup:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getSerieTrailer = async (req, res) => {
    try {
        const { serieId } = req.params;

        // Call TMDB API for videos
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos`, {
            params: {
                api_key: process.env["TMDB_API_KEY"],
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
        if (error.response) {
            console.error('TMDB API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: error.response.data.status_message });
        } else if (error.request) {
            console.error('No response received from TMDB API');
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Error during TMDB API request setup:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};



export { getMovies, getSeries, getTopMovies, getTopSeries, searchMoviesAndSeries, getSerieDetails, getMovieDetails, getMovieTrailer, getSerieTrailer };
