
const handleApiError = (res, controllerName, error) => {
    console.error(`Error in ${controllerName}: ${error}`);
    if (error.response) {
        res.status(error.response.status ?? 400).json({ success: false, error: error.response.data.status_message ?? "Error" });
    } else {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = { handleApiError };
