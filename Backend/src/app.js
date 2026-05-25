import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();



// import all routes
import authRouter from './routes/auth.routes.js';
import interviewRouter from './routes/interview.routes.js';




const app=express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

//This is used for reading the body of the request in json format
app.use(express.json())
app.use(cookieParser());


//Use all routes
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);





export default app;
