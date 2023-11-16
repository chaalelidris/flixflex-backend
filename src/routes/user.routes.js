import express from "express"
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { addToFavorites, removeFromFavorites, getFavorites } from "../controllers/favorite.controller";
import passport from "passport";


export const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/favorites', passport.authenticate('jwt', { session: false }), getFavorites);
router.post('/favorites', passport.authenticate('jwt', { session: false }), addToFavorites);
router.delete('/favorites/:favoriteId', passport.authenticate('jwt', { session: false }), removeFromFavorites);


export default router