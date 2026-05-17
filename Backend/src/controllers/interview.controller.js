import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const pdfParse = require("pdf-parse"); 
import interviewReportModel from "../models/interviewReport.js";
import { generateInterviewReport,generateResumePdf } from "../services/ai.service.js";


export const generatesInterviewReport = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const resumeData = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
          
        const { selfDescription, jobDescription } = req.body;

        if (!resumeData.text || !selfDescription || !jobDescription) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeData.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user._id, 
            resume: resumeData.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Report error:", error.message);
        res.status(500).json({
            message: "Error generating interview report",
            error: { name: error.name, message: error.message }
        });
    }
};



export const getInterviewReportById = async (req, res) => { 
    try{
        const { interviewId } = req.params;

        if (!interviewId) {
            return res.status(400).json({ message: "Interview ID is required" });
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });


    }catch(error){
        res.status(500).json({
            message: "Error fetching interview report",
            error: { name: error.name, message: error.message }
        });
    }
}


export const getAllInterviewReports = async (req, res) => {
    try{
        const userId=req.user._id;
        const interviewReports = await interviewReportModel.find({ user: userId }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });

    }catch(error){
        res.status(500).json({
            message: "Error fetching interview reports",
            error: { name: error.name, message: error.message }
        });
    }

}


export const generateResumePDF = async (req, res) => {
    try{


        const { interviewId } = req.params;
        if (!interviewId) {
            return res.status(400).json({ message: "Interview ID is required" });
        }

        const interviewReport = await interviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        const {resume,selfDescription,jobDescription}=interviewReport;

        const pdfBuffer=await generateResumePdf({resume,selfDescription,jobDescription});
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=Resume_${interviewId}.pdf`,
        });
        res.send(pdfBuffer);       
        
     
  
      


    }catch(error){
        res.status(500).json({
            message: "Error fetching interview reports",
            error: { name: error.name, message: error.message }
        });
    }
         
    
}