import express from "express"
import { getMovies, getSeries, getTopMovies, getTopSeries, searchMoviesAndSeries, getSerieDetails, getMovieDetails, getMovieTrailer, getSerieTrailer } from "../controllers/movie.controller";

export const router = express.Router();

// Movies
router.get('/movies', getMovies);
router.get('/movies/top', getTopMovies);
router.get('/movies/:movieId', getMovieDetails);
router.get('/movies/:movieId/trailer/', getMovieTrailer);

// Series
router.get('/series', getSeries);
router.get('/series/top', getTopSeries);
router.get('/series/:serieId', getSerieDetails);
router.get('/series/:serieId/trailer/', getSerieTrailer);

router.get('/search/multi', searchMoviesAndSeries);




export default router