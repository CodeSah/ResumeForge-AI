export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  portfolio: string;
  github: string;
  linkedin: string;
  photo?: string; // Base64 data-url or static image URL
  professionalTitle: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
  type?: 'job' | 'internship' | 'research' | 'leadership';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  gpa: string;
  location?: string;
  minors?: string;
  honors?: string;
  coursework?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'other';
}

export interface ResumeData {
  personal: PersonalDetails;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  publications?: string;
  honorsAndAwards?: string;
  showExperience?: boolean;
  showInternships?: boolean;
  showResearch?: boolean;
  showLeadership?: boolean;
}

export type TemplateType = 'campus_placement' | 'modern_resume' | 'apply_abroad' | 'classic_corporate' | 'personal_favourite';

export interface ATSResult {
  score: number;
  matchScore: number;
  formattingScore: number;
  grammarScore: number; // For official ATS analysis breakdown
  keywordDensityScore: number; // For official ATS analysis breakdown
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  improvementSuggestions: string[];
  tailoredBioSample: string;
  roleExplanation: string;
}

export interface CoverLetterResult {
  content: string;
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'fit';
  suggestedPoints: string[];
  sampleAnswer: string;
}

export interface JobMatchResult {
  roleTitle: string;
  matchScore: number;
  skillsGap: string[];
  learningPlan: string[];
  salaryEstimate: string;
  shortTermStrategy: string;
}

