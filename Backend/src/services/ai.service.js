import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

// ✅ z aur zodToJsonSchema ki zaroorat nahi — hata diya
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// ─── INTERVIEW REPORT SCHEMA (aapka existing — same rakha) ────────────────────
const interviewReportSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Job title from the job description e.g. 'Senior Full Stack Developer'",
    },
    matchScore: {
      type: "number",
      description: "Integer 0-100. Honest match score between candidate and job.",
    },
    technicalQuestions: {
      type: "array",
      description: "Exactly 8 technical questions tailored to this job and candidate.",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      description: "Exactly 6 behavioral questions using STAR format.",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      description: "3-6 real skill gaps from comparing JD vs candidate profile.",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description: "Exactly 7-day preparation plan. Day 1 = most critical gap.",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};


function buildPrompt({ resume, selfDescription, jobDescription }) {
  return `
You are an expert technical interview coach with 10+ years of experience across all engineering domains.

Analyze the candidate profile against the job description and generate a complete, 
personalized interview preparation report.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF-DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

STRICT INSTRUCTIONS — follow these exactly:

1. title:
   Extract the exact job title from the job description.

2. matchScore:
   Give an honest integer 0–100 based on how well the candidate's resume and 
   self-description match the job requirements. Be realistic and strict.

3. technicalQuestions — Generate EXACTLY 8 questions:
   - Read the job description carefully and identify the PRIMARY tech stack and skills required.
   - Do NOT assume the stack. If the JD is about AI/ML, ask about Python, PyTorch, LLMs, etc.
     If it's about DevOps, ask about Docker, Kubernetes, CI/CD, etc.
     If it's about mobile, ask about React Native, Swift, Kotlin, etc.
     If it's about backend, ask about the specific languages and frameworks in the JD.
   - Generate 8 questions that cover different areas of THIS specific job's requirements.
   - Each question must map to a skill or responsibility explicitly mentioned in the job description.
   - For each question provide:
     * question: A realistic, specific interview question for this role
     * intention: What skill or knowledge is the interviewer testing (1 sentence)
     * answer: A detailed model answer (3–5 sentences). Include key points to cover,
       approach to take, and reference the candidate's own projects/experience where relevant.

4. behavioralQuestions — Generate EXACTLY 6 questions:
   These are role-agnostic soft-skill questions but framed for this specific role:
   - Q1: How have you handled a technical conflict with a teammate?
   - Q2: Describe a time you delivered a project under a tight deadline.
   - Q3: Tell me about a new technology you had to learn quickly for a project.
   - Q4: How do you collaborate with non-technical team members or stakeholders?
   - Q5: Describe a time you failed at something technical and what you learned.
   - Q6: Why are you interested in this specific role and what are your goals?
   For each question provide:
   * question: The behavioral question
   * intention: What trait is being evaluated (1 sentence)
   * answer: STAR method answer (3–5 sentences) referencing candidate's actual experience from resume.

5. skillGaps — List 3–6 gaps:
   - Compare ONLY the job description requirements against the candidate's resume.
   - Only list skills the JD explicitly requires but the candidate clearly lacks evidence of.
   - Do NOT list skills the candidate already demonstrates in their resume.
   - severity: high = critical for role and missing, medium = partial exposure, low = nice-to-have

6. preparationPlan — EXACTLY 7 days:
   - Base the plan on the actual skill gaps and JD requirements, not a generic template.
   - Day 1–2: Address the highest severity skill gaps with specific resources.
   - Day 3–5: Strengthen the candidate's existing skills that are most relevant to this role.
   - Day 6: Mock technical interview — practice the 8 technical questions generated above.
   - Day 7: Behavioral prep using the 6 behavioral questions + research this type of company/role.
   - Each day: 3–5 specific, actionable tasks (include resource names, methods, or practice problems).

CRITICAL RULES:
- ALL arrays must be populated. Never return empty arrays.
- Technical questions must match THIS job's stack — not a generic web dev template.
- Behavioral answers must reference the candidate's actual resume content.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.


Be strict: most candidates score between 45–75. 
Only give 80+ if the resume matches 90%+ of JD requirements explicitly.
`;
}



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = buildPrompt({ resume, selfDescription, jobDescription });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
      temperature: 0.7,
    },
  });

  const parsed = JSON.parse(response.text);

  if (
    !parsed.technicalQuestions?.length ||
    !parsed.behavioralQuestions?.length ||
    !parsed.preparationPlan?.length
  ) {
    throw new Error("Model returned incomplete data. Please try again.");
  }

  return parsed;
}


async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });

  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  
  const resumePdfSchema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "Complete HTML of the resume with all inline CSS. Ready to convert to PDF with puppeteer.",
      },
    },
    required: ["html"],
  };

const prompt = `Generate a professional resume in HTML format for this candidate.

Resume data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Requirements:
- Tailor the resume specifically for the given job description
- Highlight the most relevant skills, projects, and experience for this role
- Write in a natural, human tone — not AI-sounding
- Simple, clean, professional design with subtle color accents
- ATS-friendly: no tables for layout, no columns, use proper heading hierarchy (h1, h2, h3)
- Maximum 1-2 pages when printed as A4 PDF
- Include these sections: contact info, professional summary, technical skills, projects, experience, education
- All CSS must be inline (no external stylesheets, no <style> tags)
- Return ONLY valid JSON with a single "html" field containing the complete HTML document`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",

      responseSchema: resumePdfSchema,
    },
  });


  const jsonContent = JSON.parse(response.text);

  if (!jsonContent.html) {
    throw new Error("AI did not return HTML content for the resume.");
  }

 
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  
  return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
}

export { generateInterviewReport, generateResumePdf };