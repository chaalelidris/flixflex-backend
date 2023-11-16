import express from "express"
import { getMovies, getSeries, getTopMovies, getTopSeries, searchMoviesAndSeries, getSerieDetails, getMovieDetails, getTrailer } from "../controllers/movie.controller";

export const router = express.Router();

// Movies
router.get('/movies', getMovies);
router.get('/movies/top', getTopMovies);
router.get('/movies/:movieId', getMovieDetails);

// Series
router.get('/series', getSeries);
router.get('/series/top', getTopSeries);
router.get('/series/:serieId', getSerieDetails);

router.get('/search/multi/:query', searchMoviesAndSeries);
router.get('/trailer/:itemType/:itemId', getTrailer);




export default router