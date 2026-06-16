import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateType } from './types';
import { initialResumeData } from './data/defaultData';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ATSChecker from './components/ATSChecker';
import AIAssistant from './components/AIAssistant';
import { Sparkles, FileText, CheckSquare, Target, Settings, Download, Palette, RefreshCw, LogOut } from 'lucide-react';
import { fetchUserResume, saveUserResume } from './lib/firestoreService';

function AppContent() {
const user = {
  uid: "guest-user"
};
const loading = false;
const logout = () => {};
const isDemoMode = true;
  
  // Local storage binding key with user distinction
  const STORAGE_KEY = user ? `ai_resume_builder_data_${user.uid}` : 'ai_resume_builder_data';

  const [isSyncing, setIsSyncing] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Initialize state from existing localStorage block or default pre-populated data
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved resume data, fallback to defaults', e);
      }
    }
    return initialResumeData;
  });

  // Layout parameters
  const [currentSection, setCurrentSection] = useState<'editor' | 'ats' | 'career'>('editor');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('personal_favourite');
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'rose' | 'amber' | 'slate'>('indigo');
  const [experienceSplit, setExperienceSplit] = useState<'split' | 'unified'>('split');

  // Load from Firestore as top-level authority once user is authenticated
  useEffect(() => {
    if (!user) {
      setIsSyncing(false);
      return;
    }

    let isSubscribed = true;
    setIsSyncing(true);

    async function loadCloudData() {
      try {
        const cloudData = await fetchUserResume(user.uid);
        if (isSubscribed && cloudData) {
          setResumeData(cloudData);
        }
      } catch (err) {
        console.error('Failed to sync cloud user resume', err);
      } finally {
        if (isSubscribed) {
          setIsSyncing(false);
          setSyncStatus('saved');
        }
      }
    }

    loadCloudData();

    return () => {
      isSubscribed = false;
    };
  }, [user?.uid]);

  // Save changes to cloud / local storage with debouncing to protect Firestore write limits
  useEffect(() => {
    if (!user || isSyncing) return;

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveUserResume(user.uid, resumeData);
        setSyncStatus('saved');
      } catch (err) {
        console.error('Failed to auto-save user changes to database:', err);
        setSyncStatus('error');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resumeData, user?.uid, isSyncing]);

  // If loading, show elegant setup placeholder
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-250 border-t-indigo-650 rounded-full animate-spin text-slate-800"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Initializing career dashboard...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show the designated LoginPanel
if (!user) {
  console.log("Guest mode");
}

  // Handle restoring to pristine default mock datasets
  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all active text to the default Senior Engineer demo profile? This will replace your current edits.')) {
      setResumeData(initialResumeData);
    }
  };

  // Callback to merge AI-optimized ATS summary back to profile
  const handleApplyAtsSummary = (newSummary: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        summary: newSummary
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 border border-indigo-150 rounded-lg text-indigo-600 font-sans">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-md font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1 font-sans">
              ResumeForge AI
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full uppercase scale-90 font-sans">Pro</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap font-sans">
              <p className="text-[10px] text-slate-500 font-medium font-sans">ATS Scoring Checker & Career Copilot Engine</p>
              <div className="h-2.5 w-[1px] bg-slate-300 hidden sm:block"></div>
              {syncStatus === 'saving' && (
                <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              )}
              {syncStatus === 'saved' && (
                <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 select-none" title="All edits saved locally and in the cloud">
                  ● Cloud Saved
                </span>
              )}
              {isSyncing && (
                <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 border border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                  Syncing...
                </span>
              )}
              {syncStatus === 'error' && (
                <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5">
                  ⚠️ Sync Off
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Toolbar Action triggers */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 hover:bg-slate-100 transition shadow-xs font-semibold cursor-pointer font-sans"
            title="Reload developer resume sample"
            id="global-reset-btn"
          >
            <RefreshCw size={12} className="text-slate-400 shrink-0" />
            Reset to Sample Dev Data
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>

          {/* Authenticated User Badge & Logout Option */}
          <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200 rounded-lg pl-2.5 pr-1.5 py-1 font-sans">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-5.5 h-5.5 rounded-full border border-slate-200 object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5.5 h-5.5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : (user.email ? user.email.slice(0, 2).toUpperCase() : 'US')}
              </div>
            )}
            
            <div className="flex flex-col text-left max-w-[110px] truncate leading-tight">
              <span className="font-extrabold text-slate-800 text-[10.5px] truncate">
                {user.displayName || 'Developer Member'}
              </span>
              <span className="text-[8.5px] text-slate-400 font-semibold truncate">
                {user.email || 'sandbox@resumeforge.local'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              type="button"
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition cursor-pointer"
              title="Logout from console"
            >
              <LogOut size={13} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Content Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed">
        {/* Left Control Workspace panel - spans 5 of 12 columns */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Main Tab controller segments */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 grid grid-cols-3 gap-1">
            <button
              onClick={() => setCurrentSection('editor')}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition leading-none ${
                currentSection === 'editor'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="work-tab-editor"
            >
              <FileText size={14} />
              <span>Resume Builder</span>
            </button>
            <button
              onClick={() => setCurrentSection('ats')}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition leading-none ${
                currentSection === 'ats'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="work-tab-ats"
            >
              <CheckSquare size={14} />
              <span>ATS Score</span>
            </button>
            <button
              onClick={() => setCurrentSection('career')}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition leading-none ${
                currentSection === 'career'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="work-tab-career"
            >
              <Target size={14} />
              <span>Cover Letter Creator</span>
            </button>
          </div>

          {/* Render active interactive panel */}
          <div className="flex-1 overflow-y-visible">
            {currentSection === 'editor' && (
              <ResumeForm data={resumeData} onChange={setResumeData} />
            )}
            {currentSection === 'ats' && (
              <ATSChecker data={resumeData} onApplyOptimizedSummary={handleApplyAtsSummary} />
            )}
            {currentSection === 'career' && (
              <AIAssistant data={resumeData} />
            )}
          </div>
        </div>

        {/* Right Preview Showcase Canvas - spans 7 of 12 columns */}
        <div className="xl:col-span-7 flex flex-col gap-4 self-start xl:sticky xl:top-6">
          {/* Custom style customization banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center gap-1 text-slate-700 font-bold tracking-tight">
              <Palette size={14} className="text-indigo-500" />
              <span>Visual Layout Customization (Live Preview)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Template Selectors */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 uppercase text-[9px] tracking-wide">Resume Style Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium font-sans text-xs"
                >
                  <option value="personal_favourite">🌟 My Personal Favourite (Official Recruiter Blue-Rule Design)</option>
                  <option value="campus_placement">📋 Campus Placement Template (Highly Structured, Photo Academic Column)</option>
                  <option value="modern_resume">✨ Modern Resume Template (Sleek Grid, Elevated Accents)</option>
                  <option value="apply_abroad">🌍 Apply Abroad Template (ATS-Optimal, Strict Recruiter Standard)</option>
                  <option value="classic_corporate">💼 Classic Corporate Template (Traditional Serif, Elegant Rule Dividers)</option>
                </select>
              </div>

              {/* Work Experience Grouping Toggle */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 uppercase text-[9px] tracking-wide">Work Experience Style</label>
                <select
                  value={experienceSplit}
                  onChange={(e) => setExperienceSplit(e.target.value as 'split' | 'unified')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium font-sans text-xs"
                >
                  <option value="split">📁 Split Jobs & Internships</option>
                  <option value="unified">💼 Combined Single Section</option>
                </select>
              </div>

              {/* Accent Color Pickers */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 uppercase text-[9px] tracking-wide">Brand Highlight Accent</label>
                <div className="flex items-center gap-2.5 h-8">
                  {(['indigo', 'emerald', 'rose', 'amber', 'slate'] as const).map((color) => {
                    const bgColors = {
                      indigo: 'bg-indigo-500 border-indigo-200 ring-indigo-500',
                      emerald: 'bg-emerald-500 border-emerald-200 ring-emerald-500',
                      rose: 'bg-rose-500 border-rose-200 ring-rose-500',
                      amber: 'bg-amber-500 border-amber-200 ring-amber-500',
                      slate: 'bg-slate-705 border-slate-400 ring-slate-700'
                    };
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        className={`w-6 h-6 rounded-full border shadow-xs transition-all ${bgColors[color]} ${
                          accentColor === color ? 'ring-2 ring-offset-2 scale-110' : 'opacity-75 hover:opacity-100 hover:scale-105'
                        }`}
                        title={`Select ${color} highlight`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Actual template rendering container */}
          <ResumePreview data={resumeData} template={selectedTemplate} accentColor={accentColor} experienceSplit={experienceSplit} />
        </div>
      </main>

      {/* Footer credits bar */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-[10.5px] text-slate-500 font-sans tracking-wide">
        &copy; 2026 ResumeForge AI. Developed by <strong>Khushi Kumari Sah</strong>. All rights reserved.
      </footer>
    </div>
  );
}

// Wrap the main exported component inside the AuthProvider context
export default function App() {
  return <AppContent />;
}
