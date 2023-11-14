import express from "express"
import { registerUser } from "../controllers/user.controller.js";

export const router = express.Router();

router.post('/register', registerUser);


export default router