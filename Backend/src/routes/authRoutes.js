import express from "express";
import {register, login, logout} from '../controller/authController.js'

const router = express.Router();

//register
router.post("/register", register);

//login
router.post("/login", login);

//logout
router.post("/logout", logout) 

export default router;
