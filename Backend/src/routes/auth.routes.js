import express from 'express';
import { registerUser,loginUser, logoutUser , getUser } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter=express.Router();

authRouter.get('/get-user',authMiddleware,getUser);
authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.post('/logout',logoutUser)


export default authRouter;

