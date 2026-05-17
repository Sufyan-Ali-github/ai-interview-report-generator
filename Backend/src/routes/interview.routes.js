import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import { generatesInterviewReport,getInterviewReportById,getAllInterviewReports,generateResumePDF } from '../controllers/interview.controller.js';
import {upload} from '../middlewares/file.middleware.js';


const interviewRouter=express.Router();

// GET /api/interview/generate-report
//for genearte report we need to send the resume file and job details in form data format so we are using multer middleware to handle the file upload and authMiddleware to check if the user is authenticated or not
interviewRouter.post('/generate-report',authMiddleware,upload.single('resume'),generatesInterviewReport);



// GET /api/interview/report/:interviewId
//This route is used to get the interview report by id and it is protected route so we are using authMiddleware to check if the user is authenticated or not
interviewRouter.get('/report/:interviewId',authMiddleware,getInterviewReportById);




// GET /api/interview/reports
//This route is used to get all interview reports of the authenticated user and it is protected route so we are using authMiddleware to check if the user is authenticated or not
interviewRouter.get('/reports',authMiddleware,getAllInterviewReports);





// POST /api/interview/resume/pdf/:interviewId
//This route is used to generate a PDF resume based on the interview report
interviewRouter.post('/resume/pdf/:interviewId',authMiddleware,generateResumePDF);

export default interviewRouter;