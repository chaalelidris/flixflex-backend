import express from "express"
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { addToFavorites, removeFromFavorites, getFavorites } from "../controllers/favorite.controller.js";
import passport from "passport";
import { authValidationRules, validate } from "../middleware/validationMiddleware.js";


export const router = express.Router();

router.post('/register', authValidationRules, validate, registerUser);
router.post('/login', authValidationRules, validate, loginUser);

router.get('/favorites', passport.authenticate('jwt', { session: false }), getFavorites);
router.post('/favorites', passport.authenticate('jwt', { session: false }), addToFavorites);
router.delete('/favorites/:favoriteId', passport.authenticate('jwt', { session: false }), removeFromFavorites);


export default router