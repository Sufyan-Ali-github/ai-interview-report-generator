import { getAllInterviewReports, getInterviewReportById, generateInterviewReport,generateResumePDF } from "../services/interview.api";
import { InterviewContext } from "../interview.context.jsx";

import { useContext, useCallback } from "react";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resume: resumeFile });
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error("Error generating report:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

  
    const fetchReportById = useCallback(async (interviewId) => {
        if (!interviewId) return;
        setLoading(true);
        try {
            const data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
        } catch (error) {
            console.error("Error fetching report by ID:", error.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setReport]);

    const fetchAllReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllInterviewReports();
            setReports(data.interviewReports || []);
        } catch (error) {
            console.error("Error fetching all reports:", error.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setReports]);

    const getResumePdf=async (interviewId)=>{
        setLoading(true);
        let response=null;
        try{
            response=await generateResumePDF(interviewId);
            const url=window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link=document.createElement("a");
            link.href=url;
            link.setAttribute("download", `resume_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
           // link.remove();

        }catch(error){
            console.error("Error generating resume PDF:", error.message);
        }finally{
            setLoading(false);
        }       
    }

    return { loading, report, reports, generateReport, fetchReportById, fetchAllReports, getResumePdf };
};