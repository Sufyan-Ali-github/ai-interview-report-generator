import { client } from "../../../api/client.js"


export const generateInterviewReport = async ({jobDescription, selfDescription, resume}) => {
    try {
        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        formData.append("resume", resume);

        const response = await client.post("/interview/generate-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}



export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await client.get(`/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}



export const getAllInterviewReports = async () => {
    try {
        const response = await client.get("/interview/reports");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }

}

export const generateResumePDF = async (interviewId) => {
    try {
        const response = await client.post(`/interview/resume/pdf/${interviewId}`,null, {
            responseType: "blob"
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}