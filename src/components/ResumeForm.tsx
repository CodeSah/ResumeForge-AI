import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Project, Skill } from '../types';
import { Plus, Trash2, Sparkles, AlertCircle, Check, HelpCircle, Loader2 } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  // AI assist state values
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAiSection, setActiveAiSection] = useState<{ type: string; id?: string } | null>(null);
  const [aiTargetRole, setAiTargetRole] = useState(data.personal.professionalTitle || 'Software Engineer');
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [aiResult, setAiResult] = useState<{ suggestedText: string; reasoningExplanation: string; alternativePhrasings: string[] } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  // Work experience helpers
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({
      ...data,
      experience: [...data.experience, newExp]
    });
  };

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => {
        if (exp.id === id) {
          const updated = { ...exp, [field]: value };
          if (field === 'current' && value === true) {
            updated.endDate = '';
          }
          return updated;
        }
        return exp;
      })
    });
  };

  const handleDeleteExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  // Education helpers
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      gpa: ''
    };
    onChange({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    });
  };

  const handleDeleteEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  // Project helpers
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: '',
      description: '',
      technologies: '',
      link: ''
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => (proj.id === id ? { ...proj, [field]: value } : proj))
    });
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  // Skills helpers
  const handleAddSkill = (category: 'technical' | 'soft' | 'other') => {
    const newSkill: Skill = {
      id: `sk_${Date.now()}`,
      name: '',
      category
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill]
    });
  };

  const handleUpdateSkill = (id: string, value: string) => {
    onChange({
      ...data,
      skills: data.skills.map(sk => (sk.id === id ? { ...sk, name: value } : sk))
    });
  };

  const handleDeleteSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter(sk => sk.id !== id)
    });
  };

  // AI Content Suggestion Trigger
  const triggerAiWriter = async (sectionType: string, currentContent: string, itemId?: string) => {
    setActiveAiSection({ type: sectionType, id: itemId });
    setAiResult(null);
    setAiError(null);
    setAiDraftPrompt(currentContent);
    setAiTargetRole(data.personal.professionalTitle || 'Software Engineer');
  };

  const fetchAiPolish = async () => {
    if (!activeAiSection) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/resume-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: activeAiSection.type,
          currentText: aiDraftPrompt,
          roleTarget: aiTargetRole,
          contextText: data.personal.summary
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error generating suggestions.');
      }

      const parsed = await response.json();
      setAiResult(parsed);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Call failed. Make sure your GEMINI_API_KEY is configured.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiText = (textToApply: string) => {
    if (!activeAiSection) return;

    if (activeAiSection.type === 'summary') {
      onChange({
        ...data,
        personal: {
          ...data.personal,
          summary: textToApply
        }
      });
    } else if (activeAiSection.type === 'experience' && activeAiSection.id) {
      onChange({
        ...data,
        experience: data.experience.map(exp => (exp.id === activeAiSection.id ? { ...exp, description: textToApply } : exp))
      });
    }

    // Reset layout
    setActiveAiSection(null);
    setAiResult(null);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* AI Floating Optimizer Panel */}
      {activeAiSection && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-xl border border-indigo-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-indigo-300 uppercase">
              <Sparkles size={14} className="text-amber-400" />
              Gemini AI Content Optimizer
            </span>
            <button
              onClick={() => setActiveAiSection(null)}
              className="text-xs text-slate-300 hover:text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition"
              id="ai-panel-close"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Position for Optimization</label>
                <input
                  type="text"
                  value={aiTargetRole}
                  onChange={(e) => setAiTargetRole(e.target.value)}
                  className="w-full bg-white/10 border border-indigo-500/25 rounded p-2 text-white focus:outline-none focus:border-indigo-400"
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Editing Mode</label>
                <div className="p-2 bg-white/5 border border-white/10 text-slate-300 rounded">
                  Optimizing for <strong className="text-amber-300 italic font-mono text-[11px]">{activeAiSection.type === 'summary' ? 'Executive Bio Summary' : 'Experience Bullet Point'}</strong>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Draft Material Context</label>
              <textarea
                value={aiDraftPrompt}
                onChange={(e) => setAiDraftPrompt(e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-indigo-500/25 rounded p-2 text-white text-xs focus:outline-none focus:border-indigo-400 placeholder-slate-400 font-sans"
                placeholder={activeAiSection.type === 'summary' ? "Describe your career highlights and focus..." : "List your accomplishments at this role..."}
              />
            </div>

            <button
              onClick={fetchAiPolish}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 transition shadow-md"
              id="ai-generate-action"
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing resume data & phrasing bullet points...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-amber-300" />
                  Generate High-Action Phrasings
                </>
              )}
            </button>

            {aiError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>{aiError}</div>
              </div>
            )}

            {aiResult && (
              <div className="space-y-4 pt-3 border-t border-white/10 text-xs">
                <div>
                  <h4 className="text-amber-300 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Recommended Phrasing (XYZ Structured)</h4>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 text-xs font-medium leading-relaxed select-all">
                    {aiResult.suggestedText}
                  </div>
                  <button
                    onClick={() => applyAiText(aiResult.suggestedText)}
                    className="mt-2 inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-3 rounded text-[11px] transition"
                  >
                    <Check size={12} /> Apply Phrasing
                  </button>
                </div>

                {aiResult.reasoningExplanation && (
                  <div>
                    <h4 className="text-slate-300 font-bold mb-1 uppercase tracking-wide text-[10px]">Why this improves ATS metrics</h4>
                    <p className="text-slate-400 italic leading-relaxed text-[11px]">{aiResult.reasoningExplanation}</p>
                  </div>
                )}

                {aiResult.alternativePhrasings?.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Alternative Creative Styles</h4>
                    <div className="space-y-2">
                      {aiResult.alternativePhrasings.map((alt, idx) => (
                        <div key={idx} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded flex justify-between items-center gap-3 transition">
                          <p className="text-slate-200 text-[11px] leading-relaxed flex-1 select-all">{alt}</p>
                          <button
                            onClick={() => applyAiText(alt)}
                            className="text-indigo-300 hover:text-white font-semibold underline text-[10px]"
                          >
                            Use
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. Contact / General Profile */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="border-b pb-3 border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Contact & General Profile</h2>
          <p className="text-xs text-slate-500">How employers and automated ATS matching services identify you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Full Legal Name</label>
            <input
              type="text"
              value={data.personal.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Alex Carter"
              id="input-personal-name"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Professional Target Title</label>
            <input
              type="text"
              value={data.personal.professionalTitle}
              onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Senior Frontend Software Architect"
              id="input-personal-title"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Contact Email Address</label>
            <input
              type="email"
              value={data.personal.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="alex@careerdev.io"
              id="input-personal-email"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              value={data.personal.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="+1 (555) 019-2834"
              id="input-personal-phone"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Location (City, State / Remote)</label>
            <input
              type="text"
              value={data.personal.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="San Francisco, CA"
              id="input-personal-location"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Personal Portfolio / Website</label>
            <input
              type="text"
              value={data.personal.portfolio}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://alexcarter.dev"
              id="input-personal-portfolio"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={data.personal.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://github.com/alexcarterdev"
                id="input-personal-github"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={data.personal.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://linkedin.com/in/alexcarterdev"
                id="input-personal-linkedin"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-150">
            <label className="block text-slate-600 font-bold mb-1 font-sans text-xs">Profile Photo (Optional - for Photo Academic template)</label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {data.personal.photo && (
                <img
                  src={data.personal.photo}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 bg-white"
                  referrerPolicy="no-referrer"
                />
              )}
              <input
                type="text"
                value={data.personal.photo || ''}
                onChange={(e) => updatePersonalInfo('photo', e.target.value)}
                className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://images.unsplash.com/... or upload real picture"
                id="input-personal-photo"
              />
              <div className="flex gap-2 shrink-0">
                <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-3 border border-slate-300 rounded-lg flex items-center gap-1.5 transition">
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updatePersonalInfo('photo', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {data.personal.photo && (
                  <button
                    type="button"
                    onClick={() => updatePersonalInfo('photo', '')}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs shrink-0 px-2"
                  >
                    Clear Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-600 font-bold">Executive Bio Summary</label>
              <button
                type="button"
                onClick={() => triggerAiWriter('summary', data.personal.summary)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold text-[11px]"
                id="sum-ai-polish"
              >
                <Sparkles size={11} className="text-amber-500" />
                Rewrite with Gemini Gemini AI
              </button>
            </div>
            <textarea
              value={data.personal.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 pr-4 text-xs font-sans"
              placeholder="Write a high-concept summary of your target goals, strengths, and background..."
              id="input-personal-summary"
            />
          </div>
        </div>
      </section>

      {/* 2. Professional Work History */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Work History & Placements</h2>
            <p className="text-xs text-slate-500">Provide quantifiable metrics, dates, locations, and choose target sections.</p>
          </div>
          <button
            type="button"
            onClick={handleAddExperience}
            className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 rounded-lg shadow-sm transition"
            id="add-exp-btn"
          >
            <Plus size={14} /> Add Role
          </button>
        </div>

        {/* Form Choose Option: Section level presence checkboxes */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
          <p className="font-bold text-slate-700 text-[10.5px] uppercase tracking-wide">Visible Sections in Resume Styles:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showExperience !== false}
                onChange={(e) => onChange({ ...data, showExperience: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Work Experiences</span>
            </label>
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showInternships !== false}
                onChange={(e) => onChange({ ...data, showInternships: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Internships</span>
            </label>
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showResearch !== false}
                onChange={(e) => onChange({ ...data, showResearch: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Research Experiences</span>
            </label>
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showLeadership !== false}
                onChange={(e) => onChange({ ...data, showLeadership: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Leadership Experiences</span>
            </label>
          </div>
        </div>

        {data.experience.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No work experience recorded yet. Add a role to populate this card.
          </div>
        ) : (
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative group font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 opacity-60 hover:opacity-100 transition"
                  title="Remove experience block"
                >
                  <Trash2 size={16} />
                </button>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Role #{index + 1}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Stripe Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Position / Job Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. senior backend dev"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Role Categorization / Section placement</label>
                    <select
                      value={exp.type || 'job'}
                      onChange={(e) => handleUpdateExperience(exp.id, 'type', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      <option value="job">💼 Work Experiences / Jobs</option>
                      <option value="internship">🎓 Internship placement</option>
                      <option value="research">🔬 Research Experience</option>
                      <option value="leadership">🗣️ Leadership Experiences / Volunteer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Location of Role</label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Hattiesburg, MS or San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">End Date</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        className="col-span-2 bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40"
                      />
                      <label className="flex items-center gap-1 text-[11px] text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Current</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-600 font-bold">Bullet Accomplishments (One per line)</label>
                    <button
                      type="button"
                      onClick={() => triggerAiWriter('experience', exp.description, exp.id)}
                      className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold text-[11px]"
                    >
                      <Sparkles size={11} className="text-amber-500" />
                      Optimize accomplishments with Gemini AI
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono placeholder-slate-400 leading-relaxed"
                    placeholder="• Reconfigured payment algorithms, shortening peak latency times by 40%..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Education Profile */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Academic Credentials</h2>
            <p className="text-xs text-slate-500">Degree models and school information.</p>
          </div>
          <button
            type="button"
            onClick={handleAddEducation}
            className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 rounded-lg shadow-sm transition"
            id="add-edu-btn"
          >
            <Plus size={14} /> Add Degree
          </button>
        </div>

        {data.education.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No education parameters recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative space-y-3 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 opacity-60 hover:opacity-100 transition"
                  title="Remove school block"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">University / School</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">School Location</label>
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Hattiesburg, Mississippi"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Degree Type</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Bachelor of Science (B.S.)"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Minors (Optional)</label>
                    <input
                      type="text"
                      value={edu.minors || ''}
                      onChange={(e) => handleUpdateEducation(edu.id, 'minors', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Economic Data Analysis, Information Security"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Honors / Speakers & Key achievements</label>
                    <input
                      type="text"
                      value={edu.honors || ''}
                      onChange={(e) => handleUpdateEducation(edu.id, 'honors', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-505"
                      placeholder="e.g. Honors Keystone Scholar, TEDx Southern Miss 2025 Speaker"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1">Relevant Coursework</label>
                    <input
                      type="text"
                      value={edu.coursework || ''}
                      onChange={(e) => handleUpdateEducation(edu.id, 'coursework', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                      placeholder="e.g. Designing Solutions for Defense, Data Structures & Algorithms, Machine Learning"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Graduation Date</label>
                      <input
                        type="text"
                        value={edu.graduationDate}
                        onChange={(e) => handleUpdateEducation(edu.id, 'graduationDate', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="May 2021"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="3.82 / 4.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Projects Panel */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Key Projects</h2>
            <p className="text-xs text-slate-500">Exhibit practical execution and system architecture qualities here.</p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 rounded-lg shadow-sm transition"
            id="add-proj-btn"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>

        {data.projects.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No projects added. Exhibiting code projects increases hire outcomes by 40%.
          </div>
        ) : (
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative space-y-3 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handleDeleteProject(proj.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 opacity-60 hover:opacity-100 transition"
                  title="Remove project block"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Neural Link Engine"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Link URL (GitHub / Demo)</label>
                    <input
                      type="text"
                      value={proj.link}
                      onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="https://github.com/alex/my-app"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1">Primary Technologies (Comma Separated)</label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => handleUpdateProject(proj.id, 'technologies', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                      placeholder="React, AWS Lambda, Node.js, DynamoDB"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1">Brief Description / Contribution Outline</label>
                    <input
                      type="text"
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Engineered high throughput server-side caches, leading to 25% drop in lookup overheads."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Skills Tags */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="border-b pb-3 border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Skills Inventory</h2>
            <p className="text-xs text-slate-500">Categorize technical competencies from general leadership traits.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical Skills Column */}
          <div className="space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center border-b pb-1 border-slate-100">
              <span className="font-bold text-indigo-700 uppercase tracking-wide text-[10px]">Technical Skills & Tech Stack</span>
              <button
                type="button"
                onClick={() => handleAddSkill('technical')}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 text-[11px]"
                id="add-tech-skill"
              >
                <Plus size={13} /> Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.skills.filter(s => s.category === 'technical').map(sk => (
                <div key={sk.id} className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-205 py-1 px-2.5 rounded-lg transition-all animate-in zoom-in-95">
                  <input
                    type="text"
                    value={sk.name}
                    onChange={(e) => handleUpdateSkill(sk.id, e.target.value)}
                    className="bg-transparent border-none p-0 focus:outline-none text-[11px] font-medium w-20 focus:w-28 transition-all text-slate-800"
                    placeholder="Python, SQL, etc."
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-500 transition ml-0.5"
                    title="Delete skill"
                  >
                    ×
                  </button>
                </div>
              ))}
              {data.skills.filter(s => s.category === 'technical').length === 0 && (
                <div className="text-[11px] italic text-slate-400">No technical skill tags yet. Add one above!</div>
              )}
            </div>
          </div>

          {/* Soft Skills Column */}
          <div className="space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center border-b pb-1 border-slate-100">
              <span className="font-bold text-emerald-700 uppercase tracking-wide text-[10px]">Soft Skills & Core Qualities</span>
              <button
                type="button"
                onClick={() => handleAddSkill('soft')}
                className="text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-0.5 text-[11px]"
                id="add-soft-skill"
              >
                <Plus size={13} /> Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.skills.filter(s => s.category === 'soft').map(sk => (
                <div key={sk.id} className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-205 py-1 px-2.5 rounded-lg transition-all animate-in zoom-in-95">
                  <input
                    type="text"
                    value={sk.name}
                    onChange={(e) => handleUpdateSkill(sk.id, e.target.value)}
                    className="bg-transparent border-none p-0 focus:outline-none text-[11px] font-medium w-20 focus:w-28 transition-all text-slate-800"
                    placeholder="Leadership, etc."
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-500 transition ml-0.5"
                    title="Delete skill"
                  >
                    ×
                  </button>
                </div>
              ))}
              {data.skills.filter(s => s.category === 'soft').length === 0 && (
                <div className="text-[11px] italic text-slate-400">No soft traits recorded. Add one above!</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Certifications & Licensing Panel */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Certifications & Licensing Achievements</h2>
            <p className="text-xs text-slate-500">Exhibit verified industry credentials, online badges, or specialized certifications.</p>
          </div>
          <button
            type="button"
            onClick={() => handleAddSkill('other')}
            className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 rounded-lg shadow-sm transition"
            id="add-cert-btn"
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>

        {data.skills.filter(s => s.category === 'other').length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No certifications added yet. Displaying certified credentials increases recruiter callback rate.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.skills.filter(s => s.category === 'other').map((sk) => (
              <div key={sk.id} className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-lg transition-all text-xs">
                <input
                  type="text"
                  value={sk.name}
                  onChange={(e) => handleUpdateSkill(sk.id, e.target.value)}
                  className="bg-transparent border-none p-0 focus:outline-none text-[11px] font-semibold w-full text-slate-800 placeholder-slate-400"
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(sk.id)}
                  className="text-slate-405 hover:text-rose-600 transition pl-2"
                  title="Remove certification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Publications & Presentations Panel */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="border-b pb-3 border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Publications & Presentations</h2>
            <p className="text-xs text-slate-500">Add research publications, conference proceedings, or presentations (one per line or as bullet points).</p>
          </div>
        </div>
        <textarea
          value={data.publications || ''}
          onChange={(e) => onChange({ ...data, publications: e.target.value })}
          rows={5}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-serif leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g.&#10;• Jha, P., Hamid, H., Olukola, O., Dahal, A., & Rahimi, N. (2026). Adversarial Machine Learning for Robust Password Strength Estimation. SEDE 2025.&#10;• USM Undergraduate Symposium on Research & Creative Activity - First Place, 2025"
        />
      </section>

      {/* 8. Honors & Awards Panel */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="border-b pb-3 border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Honors, Awards & Scholarships</h2>
            <p className="text-xs text-slate-500">List scholarships, roll listings, or contest achievements (one per line or as bullet points).</p>
          </div>
        </div>
        <textarea
          value={data.honorsAndAwards || ''}
          onChange={(e) => onChange({ ...data, honorsAndAwards: e.target.value })}
          rows={5}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-serif leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g.&#10;• USM President's Lists: Fall 2023, Spring 2024, Fall 2024, Spring 2025&#10;• First Place, Undergraduate Symposium on Research and Creative Activity (UGS)&#10;• Academic Excellence Scholarship, The University of Southern Mississippi"
        />
      </section>
    </div>
  );
}
