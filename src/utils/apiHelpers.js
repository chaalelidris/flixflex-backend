
const handleApiError = (res, errorMessage, error) => {
    console.error(`Error during TMDB API request setup | ${errorMessage}:`, error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
};

module.exports = { handleApiError };
