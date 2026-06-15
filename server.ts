import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to configure lazy initialization of Google Gen AI SDK
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables. Please add it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. ATS Score Checker and Optimizer Endpoint
app.post('/api/ats-check', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and target job description are both required.' });
    }

    const ai = getGenAI();

    const prompt = `
You are an expert applicant tracking system (ATS) parser and high-level recruiter.
Evaluate the candidate's resume data against the provided target job description.

Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description:
${jobDescription}

Please perform a strict analysis and output your results strictly as a single JSON object.
Do NOT use markdown layout wrappers (like \`\`\`json ... \`\`\`) in your response text – return ONLY raw JSON that matches this exact schema:
{
  "score": number (total ATS compatibility score from 0 to 100),
  "matchScore": number (skill/experience matching sub-score from 0 to 100),
  "formattingScore": number (structure, parser-readability, flow sub-score from 0 to 100),
  "grammarScore": number (grammar, syntax correctness, and orthography quality sub-score from 0 to 100),
  "keywordDensityScore": number (keyword matching presence and redundancy ratio sub-score from 0 to 100),
  "matchedKeywords": [strings of keywords/technologies parsed in BOTH documents],
  "missingKeywords": [strings of crucial keywords/technologies present in the job description but ABSENT in the resume],
  "formattingIssues": [strings of parsing issues found in the entry, like acronym use, confusing headings, missing sections, etc.],
  "improvementSuggestions": [strings of actionable, concrete bullet points on how the user can rewrite experience to get a higher score],
  "tailoredBioSample": "A beautifully rewritten professional summary paragraph specifically designed to score 100% on the JD while remaining truthful to experience",
  "roleExplanation": "A short, encouraging explanation of why this match tier was given and the overall outlook."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/ats-check:', error);
    res.status(500).json({ error: error.message || 'Failed to complete ATS review.' });
  }
});

// 2. Resume AI Content Generator / Enhancer Endpoint
app.post('/api/resume-enhance', async (req, res) => {
  try {
    const { section, currentText, roleTarget, contextText } = req.body;
    if (!section) {
      return res.status(400).json({ error: 'Enhancement section type is required.' });
    }

    const ai = getGenAI();

    const prompt = `
You are a top-tier global resume writer and career coach.
Enhance the following text for a resume ${section} section. The target role is "${roleTarget || 'Professional'}".
Additional context of other experiences: ${contextText || 'None'}.

Current Text:
"${currentText || '(Empty - please write from scratch)'}"

Rewrite this with these principles:
- Start with powerful action verbs in the past tense (where applicable).
- Follow the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
- Maintain raw, honest metrics where possible (e.g., if none are provided, suggest placeholder metrics the user can update).
- Focus on high impact rather than generic tasks.
- Keep sentences extremely crisp, professional, and grammatically flawless.

Return a raw JSON object only. Do NOT use markdown code blocks.
Response scheme:
{
  "suggestedText": "The primary rewritten version ready for use",
  "reasoningExplanation": "A brief explanation of why this was phrased this way to optimize impact",
  "alternativePhrasings": ["Alternative 1", "Alternative 2"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/resume-enhance:', error);
    res.status(500).json({ error: error.message || 'Failed to generate enhanced bio.' });
  }
});

// 3. Tailored Cover Letter Generator Endpoint
app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { resumeData, jobDescription, recipientName, companyName, jobTitle } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and target job description are both required.' });
    }

    const ai = getGenAI();

    const prompt = `
You are an elegant, highly persuasive professional letter writer.
Create a beautifully tailored, modern cover letter matching this candidate's credentials to the target Job Description.

Candidate Details:
Name: ${resumeData.personal?.name}
Title: ${resumeData.personal?.professionalTitle}
Email: ${resumeData.personal?.email} | Phone: ${resumeData.personal?.phone}
Summary: ${resumeData.personal?.summary}

Recent Experience:
${JSON.stringify(resumeData.experience, null, 2)}

Target Details:
Job Title: ${jobTitle || 'Target Position'}
Company Name: ${companyName || 'Target Company'}
Recipient: ${recipientName || 'Hiring Manager / Recruiting Team'}

Job Description:
${jobDescription}

Ensure the letter:
- Starts with a powerful greeting.
- Opens with a hook introducing their genuine excitement and why they're perfect.
- The body links their actual success stories (experience) back to specific requirements on the Job Description.
- Demonstrates deep understanding of what the position needs.
- Closes with a professional call to action, thanking them for their consideration.
- Keeps a polished, non-arrogant yet self-assured, compelling tone (no cliches/fluff).

Return a JSON object only. Do NOT use markdown code blocks.
Response scheme:
{
  "content": "A single formatted multi-line string containing the complete cover letter draft, including address blocks, dates, and sign-offs."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/generate-cover-letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate tailored cover letter.' });
  }
});

// 4. Role-Specific Technical & Behavioral Interview Prep Generator
app.post('/api/generate-interview-prep', async (req, res) => {
  try {
    const { resumeData, targetRole, jobDescription } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required.' });
    }

    const ai = getGenAI();

    const prompt = `
You are a senior hiring manager and technical engineering interviewer at a top company.
Draft 4 customized, high-yield interview questions designed SPECIFICALLY for this candidate's background when applying for target role "${targetRole || 'the specified role'}".

Candidate Profile:
${JSON.stringify(resumeData, null, 2)}

Job Description Context (if any):
${jobDescription || 'Not specified'}

Provide 4 detailed questions containing:
- 2 Role-based technical or strategic scenarios based on actual technologies or skills in their resume.
- 1 Behavioral question (STAR method format) mapped to their past companies.
- 1 Fit/Culture question.

For each, provide the target criteria (what to highlight), and a sample answer template following top-tier speaking structures.

Return a JSON array of objects only. Do NOT use markdown code blocks.
Response schema:
[
  {
    "question": "The structured question",
    "type": "technical" | "behavioral" | "fit",
    "suggestedPoints": ["Exactly what elements in the resume/skills the candidate should mention to validate their expertise", "Alternative highlights"],
    "sampleAnswer": "A full, flawless spoken-style sample answer written in first person ('I') that demonstrates elite confidence."
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '[]';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/generate-interview-prep:', error);
    res.status(500).json({ error: error.message || 'Failed to generate interview prep toolkit.' });
  }
});

// 5. Real-Time Job Matching & Strategic Career Path Planner
app.post('/api/real-time-job-matching', async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required.' });
    }

    const ai = getGenAI();

    const prompt = `
You are an expert recruitment consultant and modern talent acquisition researcher.
Based on the candidate's current skills, experience, projects, and strengths, evaluate their immediate career prospects.

Candidate Details:
${JSON.stringify(resumeData, null, 2)}

Identify the top 3 best-matching job roles they should target in today's job market. Outline their estimated salary ranges, exact skills gap they must fill to land top-tier salaries in these roles, a short-term strategy, and a concrete learning roadmap.

Return a JSON array of exactly 3 objects. Do NOT use markdown code blocks.
Response schema:
[
  {
    "roleTitle": "Exact modern job title (e.g. Senior React Developer, ML Engineer, Product Analyst)",
    "matchScore": number (compatibility percent from 0 to 100),
    "skillsGap": [strings of missing skills or technologies needed for these seniority tiers],
    "learningPlan": [strings of certifications, courses, or mini-projects to build to bridge these gaps],
    "salaryEstimate": "Estimated annual salary range (e.g., $110,000 - $145,000)",
    "shortTermStrategy": "An actionable 30-day strategy to position their application for this specific title."
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '[]';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/real-time-job-matching:', error);
    res.status(500).json({ error: error.message || 'Failed to complete career matching analysis.' });
  }
});

// Vite Middleware integrated after API routes
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA routing fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume + ATS Server listening on port ${PORT}`);
  });
}

startServer();
