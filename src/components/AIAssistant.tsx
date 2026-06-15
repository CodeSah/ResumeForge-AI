import React, { useState } from 'react';
import { ResumeData, CoverLetterResult, InterviewQuestion, JobMatchResult } from '../types';
import { sampleJobDescription } from '../data/defaultData';
import { FileText, Award, Calendar, Lightbulb, Copy, Check, MessageSquare, Briefcase, DollarSign, Target, Loader2, Sparkles, BookOpen, Clock } from 'lucide-react';

interface AIAssistantProps {
  data: ResumeData;
}

type CareerTab = 'cover_letter' | 'interview_prep' | 'job_matching';

export default function AIAssistant({ data }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<CareerTab>('cover_letter');

  // Cover Letter states
  const [clJobTitle, setClJobTitle] = useState('Senior Full-Stack Engineer');
  const [clCompany, setClCompany] = useState('FutureFlow AI');
  const [clRecipient, setClRecipient] = useState('Hiring Manager / Tech Lead');
  const [clJobDesc, setClJobDesc] = useState(sampleJobDescription);
  const [clResult, setClResult] = useState<CoverLetterResult | null>(null);
  const [clLoading, setClLoading] = useState(false);
  const [clCopied, setClCopied] = useState(false);
  const [clError, setClError] = useState<string | null>(null);

  // Interview Prep states
  const [ipTargetRole, setIpTargetRole] = useState(data.personal.professionalTitle || 'Software Engineer');
  const [ipResult, setIpResult] = useState<InterviewQuestion[] | null>(null);
  const [ipLoading, setIpLoading] = useState(false);
  const [ipActiveQuestionIndex, setIpActiveQuestionIndex] = useState<number | null>(null);
  const [ipRevealedParts, setIpRevealedParts] = useState<{ [key: number]: 'hints' | 'sample' | null }>({});
  const [ipError, setIpError] = useState<string | null>(null);

  // Job Matcher states
  const [jmResult, setJmResult] = useState<JobMatchResult[] | null>(null);
  const [jmLoading, setJmLoading] = useState(false);
  const [jmError, setJmError] = useState<string | null>(null);

  // General handler to copy to clipboard
  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // 1. Generate Cover Letter via Backend
  const handleGenerateCoverLetter = async () => {
    setClLoading(true);
    setClError(null);
    setClResult(null);

    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: data,
          jobDescription: clJobDesc,
          recipientName: clRecipient,
          companyName: clCompany,
          jobTitle: clJobTitle
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server failed to write cover letter.');
      }

      const parsed = await res.json();
      setClResult(parsed);
    } catch (err: any) {
      console.error(err);
      setClError(err.message || 'Make sure your GEMINI_API_KEY is configured in Settings > Secrets.');
    } finally {
      setClLoading(false);
    }
  };

  // 2. Generate Interview Questions via Backend
  const handleGenerateInterviewPrep = async () => {
    setIpLoading(true);
    setIpError(null);
    setIpResult(null);
    setIpActiveQuestionIndex(0);
    setIpRevealedParts({});

    try {
      const res = await fetch('/api/generate-interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: data,
          targetRole: ipTargetRole,
          jobDescription: clJobDesc
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate interview set.');
      }

      const parsed = await res.json();
      setIpResult(parsed);
    } catch (err: any) {
      console.error(err);
      setIpError(err.message || 'Make sure your GEMINI_API_KEY is configured in Settings > Secrets.');
    } finally {
      setIpLoading(false);
    }
  };

  // 3. Generate Job Match and Career Path
  const handleGenerateJobMatching = async () => {
    setJmLoading(true);
    setJmError(null);
    setJmResult(null);

    try {
      const res = await fetch('/api/real-time-job-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to complete job matching analysis.');
      }

      const parsed = await res.json();
      setJmResult(parsed);
    } catch (err: any) {
      console.error(err);
      setJmError(err.message || 'Make sure your GEMINI_API_KEY is configured in Settings > Secrets.');
    } finally {
      setJmLoading(false);
    }
  };

  const getMatchColorClass = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-indigo-500 bg-indigo-50 border-indigo-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 font-sans">
      {/* RENDER COVER LETTER PANEL (DIRECT VIEW) */}
      <div className="space-y-4 text-xs font-sans animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">AI Tailored Cover Letter Generator</h3>
            <p className="text-slate-400 text-[11px] mb-3">Integrates your resume history directly into a styled, professional application letter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Target Role Title</label>
              <input
                type="text"
                value={clJobTitle}
                onChange={(e) => setClJobTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                placeholder="Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">Target Company</label>
              <input
                type="text"
                value={clCompany}
                onChange={(e) => setClCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                placeholder="FutureFlow AI SaaS"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">Hiring Contact Name</label>
              <input
                type="text"
                value={clRecipient}
                onChange={(e) => setClRecipient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                placeholder="Hiring Manager / Lead Dev"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Specific Job Parameters (Helps match story elements)</label>
            <textarea
              value={clJobDesc}
              onChange={(e) => setClJobDesc(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono leading-normal"
              placeholder="Paste responsibilities outline..."
            />
          </div>

          <button
            onClick={handleGenerateCoverLetter}
            disabled={clLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition py-2 px-4 font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
            id="cl-generate-btn"
          >
            {clLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Drafting tailored executive cover letter lines...
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-amber-300" />
                Draft Custom Cover Letter
              </>
            )}
          </button>

          {clError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg flex items-start gap-2">
              <Lightbulb size={14} className="shrink-0 mt-0.5" />
              <span>{clError}</span>
            </div>
          )}

          {clResult && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in" id="cl-result-box">
              <div className="flex justify-between items-center bg-slate-50 p-2 border rounded-lg">
                <span className="font-mono text-[10px] text-slate-400 font-bold">Generated Copy-Pastable Draft</span>
                <button
                  type="button"
                  onClick={() => handleCopyText(clResult.content, setClCopied)}
                  className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 bg-white border px-2.5 py-1 rounded shadow-sm text-[10px]"
                >
                  {clCopied ? (
                    <>
                      <Check size={11} className="text-emerald-500" /> Cooled!
                    </>
                  ) : (
                    <>
                      <Copy size={11} /> Copy Letter
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl leading-relaxed whitespace-pre-wrap font-sans text-slate-700 select-all max-h-[420px] overflow-y-auto">
                {clResult.content}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
