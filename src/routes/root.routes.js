import express from 'express';
import passport from 'passport';
/* controllers */
import getRoot from '../controllers/root/getRoot';
import postRoot from '../controllers/root/postRoot';

const root = express.Router()

root.get('/', passport.authenticate('jwt', { session: false }), getRoot)
root.post('/', postRoot)

export default root