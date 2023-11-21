
/**
 * Health check endpoint
 * @param {import('express').Request} _req 
 * @param {import('express').Response} res 
 */
const getRoot = (_req, res) => {
    res.status(200).json({
        name: "Flix flex",
        description: "Flix Flex Backend API",
        version: "1.6.0"
    });
}

export default getRoot