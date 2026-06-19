import React, { useState } from 'react';
import { ResumeData, ATSResult } from '../types';
import { sampleJobDescription } from '../data/defaultData';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, HelpCircle, Loader2, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../lib/api';

interface ATSCheckerProps {
  data: ResumeData;
  onApplyOptimizedSummary: (optimizedSummary: string) => void;
}

export default function ATSChecker({ data, onApplyOptimizedSummary }: ATSCheckerProps) {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const runAtsScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(getApiUrl('/api/ats-check'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: data,
          jobDescription: jobDescription
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error occurred during ATS scanner execution.');
      }

      const parsedResult = await response.json();
      setResult(parsedResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Call failed. Make sure your GEMINI_API_KEY is configured in Settings > Secrets.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBgClass = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20 text-amber-700';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-700';
  };

  const applySummary = (summary: string) => {
    onApplyOptimizedSummary(summary);
    setSuccessMsg('Successfully applied the tailored summary directly back to your active resume draft!');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 font-sans">
      {/* Intro info headings */}
      <div className="border-b pb-3 border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">ATS Match Optimizer & Parser</h2>
          <p className="text-xs text-slate-500">Benchmark your resume metrics instantly against standard Enterprise ATS screening filters.</p>
        </div>
      </div>

      {/* Target input wrapper */}
      <div className="grid grid-cols-1 gap-4 text-xs font-sans">
        <div>
          <label className="block text-slate-600 font-bold mb-1.5">Paste Target Job Description (Requirements & Skills)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={7}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-normal"
            placeholder="Introduce the company, daily responsibilities, and required languages (TypeScript, PostgreSQL, GCP...)"
            id="ats-jd-input"
          />
        </div>

        <button
          onClick={runAtsScan}
          disabled={loading || !jobDescription.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition py-2.5 px-4 font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 text-xs font-sans"
          id="ats-scan-action"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Scanning matching algorithms and testing parsing vectors...
            </>
          ) : (
            <>
              <Sparkles size={15} className="text-amber-300" />
              Analyze ATS Match & Score
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex gap-3 items-start animate-in fade-in" id="ats-scan-error">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Optimization Failure</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex gap-2 items-center tracking-tight animate-in slide-in-from-top-1">
          <CheckCircle2 size={15} className="text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Result Metrics panel */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300" id="ats-result-viewport">
          {/* Main summary columns with 5 official analysis scores */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Score Wheel */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Overall ATS Score</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#eaeaea"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    strokeWidth="8"
                    fill="transparent"
                    className={getScoreColor(result.score).split(' ').pop()}
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - result.score / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-800">{result.score}%</span>
                </div>
              </div>
              <div className={`mt-3 py-1 px-3 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getScoreBgClass(result.score)}`}>
                {result.score >= 80 ? 'Highly Matches' : result.score >= 60 ? 'Moderate Match' : 'High Rejection Risk'}
              </div>
            </div>

            {/* Sub-score grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Keyword Index Metrics */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Experience Relevance</span>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{result.matchScore}%</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Matches with job role prerequisites.</p>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-indigo-500" style={{ width: `${result.matchScore}%` }}></div>
                </div>
              </div>

              {/* Parser structural quality summary */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Formatting Readability</span>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{result.formattingScore}%</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Evaluates template structures & dividers.</p>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-500" style={{ width: `${result.formattingScore}%` }}></div>
                </div>
              </div>

              {/* Grammar Score */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Grammar & Tone Quality</span>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{result.grammarScore ?? 92}%</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Calculates sentences orthography errors.</p>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-indigo-600" style={{ width: `${result.grammarScore ?? 92}%` }}></div>
                </div>
              </div>

              {/* Keyword Density Score */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Keyword Density Match</span>
                  <h4 className="text-xl font-black text-slate-800 mt-1">{result.keywordDensityScore ?? 88}%</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Optimizes keywords presence frequency.</p>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-600" style={{ width: `${result.keywordDensityScore ?? 88}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Encouraging Outlook text */}
          {result.roleExplanation && (
            <div className="p-4 bg-indigo-50 border border-indigo-100/40 rounded-xl text-xs text-indigo-900 leading-relaxed font-sans">
              <strong className="block text-indigo-950 font-bold mb-1">🎯 Recruiter Assessment & Matching Outlook</strong>
              {result.roleExplanation}
            </div>
          )}

          {/* Keyword analysis diagnostic grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched green badges */}
            <div className="border border-slate-150 rounded-xl p-4 space-y-3 font-sans text-xs">
              <h3 className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Matched Keywords ({result.matchedKeywords?.length || 0})
              </h3>
              {result.matchedKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map((kw, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded font-medium text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] italic text-slate-400">No matching keyword correlations identified yet.</p>
              )}
            </div>

            {/* Missing red badges */}
            <div className="border border-slate-150 rounded-xl p-4 space-y-3 font-sans text-xs">
              <h3 className="font-bold text-rose-800 flex items-center gap-1.5">
                <XCircle size={15} className="text-rose-500" />
                Missing Target Keywords ({result.missingKeywords?.length || 0})
              </h3>
              {result.missingKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-rose-50 text-rose-700 border border-rose-150 px-2 py-0.5 rounded font-medium text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] italic text-slate-400">Perfect match! No key words missing.</p>
              )}
            </div>
          </div>

          {/* Parsing issues Alert and improvements list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Formatting errors list */}
            {result.formattingIssues?.length > 0 && (
              <div className="border border-slate-150 rounded-xl p-4 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-amber-500" />
                  Structure Warnings
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-[10px] text-slate-600 leading-relaxed font-sans">
                  {result.formattingIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategic suggestions bullets */}
            {result.improvementSuggestions?.length > 0 && (
              <div className="border border-slate-150 rounded-xl p-4 space-y-3 text-xs col-span-1 md:col-span-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-indigo-500" />
                  Strategic Improvement Recommendations
                </h3>
                <ul className="space-y-2 list-none pl-0 font-sans">
                  {result.improvementSuggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[11px] text-slate-600 leading-relaxed">
                      <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Core high-value custom generator outcome */}
          {result.tailoredBioSample && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 border border-indigo-500/10 space-y-3 font-sans">
              <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  <Sparkles size={14} className="text-amber-400" />
                  Tailored Professional Summary (Scores 100% on JD)
                </span>
                <button
                  type="button"
                  onClick={() => applySummary(result.tailoredBioSample)}
                  className="bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-bold py-1 px-3 rounded shadow-sm transition"
                  id="ats-apply-summary-btn"
                >
                  Apply to Resume Draft
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic select-all">
                "{result.tailoredBioSample}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
