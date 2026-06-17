import { ResumeData, TemplateType } from '../types';
import { Printer, Mail, Phone, MapPin, Globe, Github, Linkedin, Award, BookOpen, Briefcase, GraduationCap, Terminal, ExternalLink, User, Heart, Lightbulb, Users } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
  accentColor: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  experienceSplit?: 'split' | 'unified';
}

export default function ResumePreview({ data, template, accentColor, experienceSplit = 'split' }: ResumePreviewProps) {
  // Date format optimization for pristine templates
  const formatResumeDate = (dateStr: string) => {
    if (!dateStr) return '';
    // If it matches YYYY-MM
    const match = dateStr.match(/^(\d{4})-(\d{2})$/);
    if (match) {
      const [_, year, month] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // e.g., "Jan 2023"
    }
    return dateStr;
  };

  // Helper to categorize regular jobs vs. internships, research, and leadership
  const getGroupedExperience = () => {
    // Filter by explicit type if present, else fallback to keywords
    const jobs = data.experience.filter(exp => {
      if (exp.type) return exp.type === 'job';
      const isIntern = exp.position.toLowerCase().includes('intern') || 
                       exp.company.toLowerCase().includes('intern') ||
                       exp.description.toLowerCase().includes('intern') ||
                       exp.position.toLowerCase().includes('research') ||
                       exp.position.toLowerCase().includes('leader');
      return !isIntern;
    });

    const internships = data.experience.filter(exp => {
      if (exp.type) return exp.type === 'internship';
      return exp.position.toLowerCase().includes('intern') || 
             exp.company.toLowerCase().includes('intern') ||
             exp.description.toLowerCase().includes('intern');
    });

    const research = data.experience.filter(exp => exp.type === 'research');
    const leadership = data.experience.filter(exp => exp.type === 'leadership');

    if (experienceSplit === 'unified') {
      return { 
        regularJobs: [...jobs, ...internships], 
        internships: [], 
        research, 
        leadership 
      };
    }

    return { regularJobs: jobs, internships, research, leadership };
  };

  // Beautiful modern template dynamic colors mapping
  const getModernColorClasses = () => {
    switch (accentColor) {
      case 'indigo':
        return {
          bg: 'bg-indigo-500',
          text: 'text-indigo-650',
          darkText: 'text-indigo-400',
          headerBg: 'bg-indigo-500',
          borderColor: 'border-indigo-400',
          accentHex: '#6366f1',
          lightBg: 'bg-indigo-50/50',
          badgeText: 'text-indigo-600',
          fillColor: '#6366f1',
          sidebarBg: 'bg-[#1e1b4b]'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-600',
          darkText: 'text-emerald-400',
          headerBg: 'bg-emerald-500',
          borderColor: 'border-emerald-400',
          accentHex: '#10b981',
          lightBg: 'bg-emerald-50/50',
          badgeText: 'text-emerald-600',
          fillColor: '#10b981',
          sidebarBg: 'bg-[#064e3b]'
        };
      case 'rose':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-600',
          darkText: 'text-rose-400',
          headerBg: 'bg-rose-500',
          borderColor: 'border-rose-400',
          accentHex: '#f43f5e',
          lightBg: 'bg-rose-50/50',
          badgeText: 'text-rose-600',
          fillColor: '#f43f5e',
          sidebarBg: 'bg-[#4c0519]'
        };
      case 'amber':
        return {
          bg: 'bg-[#fbbe16]',
          text: 'text-[#fbbe16]',
          darkText: 'text-[#fbbe16]',
          headerBg: 'bg-[#fbbe16]',
          borderColor: 'border-[#fbbe16]',
          accentHex: '#fbbe16',
          lightBg: 'bg-amber-50/50',
          badgeText: 'text-amber-600',
          fillColor: '#fbbe16',
          sidebarBg: 'bg-[#451a03]'
        };
      case 'slate':
        return {
          bg: 'bg-slate-600',
          text: 'text-slate-700',
          darkText: 'text-slate-350',
          headerBg: 'bg-slate-600',
          borderColor: 'border-slate-500',
          accentHex: '#475569',
          lightBg: 'bg-slate-50/50',
          badgeText: 'text-slate-705',
          fillColor: '#475569',
          sidebarBg: 'bg-[#0f172a]'
        };
    }
  };

  const getAccentClass = () => {
    switch (accentColor) {
      case 'indigo': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'emerald': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'rose': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'amber': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'slate': return 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'indigo': return 'border-indigo-500';
      case 'emerald': return 'border-emerald-500';
      case 'rose': return 'border-rose-500';
      case 'amber': return 'border-amber-500';
      case 'slate': return 'border-slate-800';
    }
  };

  const getAccentTextClass = () => {
    switch (accentColor) {
      case 'indigo': return 'text-indigo-600';
      case 'emerald': return 'text-emerald-600';
      case 'rose': return 'text-rose-600';
      case 'amber': return 'text-amber-500';
      case 'slate': return 'text-slate-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Dedicated bullet points formatter that parses and outputs elegant, recruiter-approved lists
  const renderDescriptionBullets = (text: string, isSerif: boolean = false) => {
    if (!text) return null;
    
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    const hasPrefix = lines.some(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('⁃'));
    
    if (lines.length <= 1 && !hasPrefix) {
      return (
        <p className={`text-[11.5px] leading-relaxed text-slate-700 text-justify ${isSerif ? 'font-serif text-[12px]' : 'font-sans'}`}>
          {text}
        </p>
      );
    }

    return (
      <ul className={`space-y-1.5 mt-1.5 pl-1.5 ${isSerif ? 'font-serif' : 'font-sans'} list-none`}>
        {lines.map((line, idx) => {
          // Clean existing bullet prefixes like •, -, *, etc.
          const cleaned = line.replace(/^[•\-\*\u2022\u2043\u25E6⁃]\s*/, '').trim();
          if (!cleaned) return null;
          return (
            <li key={idx} className="relative pl-4 text-[11px] leading-relaxed text-slate-750 text-justify">
              <span className={`absolute left-0 top-[6px] w-[5px] h-[5px] rounded-full ${isSerif ? 'bg-slate-800' : 'bg-slate-400'}`}></span>
              {cleaned}
            </li>
          );
        })}
      </ul>
    );
  };

  // 1. Classic Corporate Template (The Harvard & Wharton Business School Gold Standard)
  const renderClassicCorporate = () => {
    const { regularJobs, internships, research, leadership } = getGroupedExperience();

    return (
      <div className="font-serif text-slate-900 space-y-6 max-w-full leading-relaxed p-10 md:p-14 bg-white select-text">
        {/* Harvard Standard Header */}
        <div className="text-center pb-3 space-y-1">
          <h1 className="text-3xl font-normal tracking-tight text-slate-955 uppercase font-serif">{data.personal.name || 'Your Name'}</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 font-sans">
            {data.personal.professionalTitle || 'Your Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-600 font-sans pt-1">
            {data.personal.email && <span>{data.personal.email}</span>}
            {(data.personal.phone || data.personal.location || data.personal.portfolio || data.personal.github || data.personal.linkedin) && <span>•</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {(data.personal.location || data.personal.portfolio || data.personal.github || data.personal.linkedin) && <span>•</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {(data.personal.portfolio || data.personal.github || data.personal.linkedin) && <span>•</span>}
            {data.personal.portfolio && <span className="hover:underline">{data.personal.portfolio.replace('https://', '')}</span>}
            {(data.personal.github || data.personal.linkedin) && <span>•</span>}
            {data.personal.github && <span className="hover:underline">{data.personal.github.replace('https://github.com/', 'github.com/')}</span>}
            {data.personal.linkedin && <span>•</span>}
            {data.personal.linkedin && <span className="hover:underline">{data.personal.linkedin.replace('https://linkedin.com/in/', 'linkedin.com/in/')}</span>}
          </div>
        </div>

        {/* Summary (Clean & Recruiter Vetted) */}
        {data.personal.summary && (
          <div className="space-y-1.5 animate-in fade-in">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-slate-900 pb-[2px] font-sans">Professional Summary</h2>
            <p className="text-[11.5px] text-justify font-serif text-slate-800 leading-relaxed pt-0.5">{data.personal.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {regularJobs.length > 0 && data.showExperience !== false && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-slate-905 pb-[2px] font-sans">Professional Experience</h2>
            <div className="space-y-4.5">
              {regularJobs.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-955 text-[12px]">
                    <div>
                      <span className="font-bold">{exp.company}</span>
                      <span className="font-normal mx-1 font-sans">—</span>
                      <span className="font-semibold italic text-slate-800 font-serif">{exp.position}</span>
                    </div>
                    <div className="text-slate-600 font-sans font-medium text-[11px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </div>
                  </div>
                  {renderDescriptionBullets(exp.description, true)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships subsections */}
        {internships.length > 0 && data.showInternships !== false && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-slate-905 pb-[2px] font-sans">Internship Experience</h2>
            <div className="space-y-4.5">
              {internships.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-955 text-[12px]">
                    <div>
                      <span className="font-bold">{exp.company}</span>
                      <span className="font-normal mx-1 font-sans">—</span>
                      <span className="font-semibold italic text-slate-800 font-serif">{exp.position}</span>
                    </div>
                    <div className="text-slate-600 font-sans font-medium text-[11px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </div>
                  </div>
                  {renderDescriptionBullets(exp.description, true)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Experience */}
        {research.length > 0 && data.showResearch !== false && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-slate-905 pb-[2px] font-sans">Research Experience</h2>
            <div className="space-y-4.5">
              {research.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-955 text-[12px]">
                    <div>
                      <span className="font-bold">{exp.company || 'Institution'}</span>
                      <span className="font-normal mx-1 font-sans">—</span>
                      <span className="font-semibold italic text-slate-800 font-serif">{exp.position}</span>
                    </div>
                    <div className="text-slate-600 font-sans font-medium text-[11px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </div>
                  </div>
                  {renderDescriptionBullets(exp.description, true)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership Experience */}
        {leadership.length > 0 && data.showLeadership !== false && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000000] border-b border-slate-905 pb-[2px] font-sans">Leadership & Service</h2>
            <div className="space-y-4.5">
              {leadership.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-955 text-[12px]">
                    <div>
                      <span className="font-bold">{exp.company || 'Organization'}</span>
                      <span className="font-normal mx-1 font-sans">—</span>
                      <span className="font-semibold italic text-slate-800 font-serif">{exp.position}</span>
                    </div>
                    <div className="text-slate-600 font-sans font-medium text-[11px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </div>
                  </div>
                  {renderDescriptionBullets(exp.description, true)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-[2px] font-sans">Notable Initiatives & Projects</h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-[12px] font-bold text-slate-955">
                    <div>
                      <span>{proj.title}</span>
                      {proj.link && (
                        <span className="text-[10px] text-slate-500 font-sans font-normal ml-2 hover:underline">
                          ({proj.link.replace('https://', '')})
                        </span>
                      )}
                    </div>
                  </div>
                  {renderDescriptionBullets(proj.description, true)}
                  {proj.technologies && (
                    <div className="text-[10.5px] italic text-slate-600 font-serif pl-1.5">
                      <span className="font-bold text-slate-800 font-sans text-[10px] uppercase tracking-wide mr-1 select-none">Technologies:</span> {proj.technologies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.filter(s => s.category !== 'other').length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-[2px] font-sans">Technical Skills & Expertise</h2>
            <div className="space-y-2 font-serif text-[11.5px] text-slate-800 pl-1.5">
              {data.skills.filter(s => s.category === 'technical').length > 0 && (
                <div className="flex items-start gap-1">
                  <span className="font-bold text-slate-905 shrink-0 w-36 font-sans text-[10px] uppercase tracking-wider pt-0.5">Technical Stack:</span>
                  <span className="leading-relaxed">{data.skills.filter(s => s.category === 'technical').map(s => s.name).join(', ')}</span>
                </div>
              )}
              {data.skills.filter(s => s.category === 'soft').length > 0 && (
                <div className="flex items-start gap-1">
                  <span className="font-bold text-slate-905 shrink-0 w-36 font-sans text-[10px] uppercase tracking-wider pt-0.5">Professional Strengths:</span>
                  <span className="leading-relaxed">{data.skills.filter(s => s.category === 'soft').map(s => s.name).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-[2px] font-sans">Education & Credentials</h2>
            <div className="space-y-3 font-serif">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-[12px] text-slate-955 font-serif">
                  <div>
                    <span className="font-bold">{edu.institution}</span>
                    <span className="font-normal mx-1 font-sans">—</span>
                    <span className="italic text-slate-800">{edu.degree} in {edu.fieldOfStudy}</span>
                  </div>
                  <div className="text-slate-600 text-right font-sans text-[11px] shrink-0">
                    <div>{edu.graduationDate}</div>
                    {edu.gpa && <div className="text-[10px] text-slate-805 font-bold">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {data.skills.filter(s => s.category === 'other').length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-[2px] font-sans">Licensures & Certifications</h2>
            <ul className="space-y-1.5 pl-1.5 list-none font-serif text-[11.5px] text-slate-800 leading-relaxed">
              {data.skills.filter(s => s.category === 'other').map((s) => (
                <li key={s.id} className="relative pl-4">
                  <span className="absolute left-0 top-[8px] w-[4px] h-[4px] rounded-full bg-slate-900"></span>
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // 2. Modern Resume Template (Nina Lane - Asymmetrical Creative Two-Column Format)
  const renderModernResume = () => {
    const { regularJobs, internships, research, leadership } = getGroupedExperience();
    const activeColor = getModernColorClasses();

    return (
      <div className="modern-resume-container font-sans text-slate-800 max-w-full bg-white select-text flex flex-col md:flex-row print:flex-row shadow-sm min-h-[900px] print:min-h-0 print:shadow-none">
        {/* Left Column (Slidably adaptive sidebar accent theme!) */}
        <div className={`w-full md:w-[290px] print:w-[230px] shrink-0 print:shrink-0 ${activeColor.sidebarBg} text-slate-100 p-6 md:p-8 print:p-5 flex flex-col relative overflow-hidden`}>
          {/* Big dynamic backdrop accent circle */}
          <div 
            className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-90 z-0 transition-colors duration-200" 
            style={{ backgroundColor: activeColor.accentHex }}
          ></div>
          
          {/* Profile Picture Frame & Centered Identity */}
          <div className="relative z-10 flex flex-col items-center pt-6 pb-6 border-b border-slate-700/60 md:border-none">
            <div className="w-28 h-28 rounded-full border-[4px] border-white overflow-hidden shadow-lg bg-slate-300 shrink-0">
              {data.personal.photo ? (
                <img
                  src={data.personal.photo}
                  alt={data.personal.name}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-slate-800 text-2xl uppercase bg-slate-200">
                  {data.personal.name ? data.personal.name.split(' ').map((n: string) => n[0]).join('') : 'AV'}
                </div>
              )}
            </div>
            
            <h1 
              className="mt-5 text-[22px] font-black tracking-normal uppercase text-center leading-tight transition-colors duration-200"
              style={{ color: activeColor.accentHex }}
            >
              {data.personal.name || 'Your Name'}
            </h1>
            <p className="mt-1 text-[11px] uppercase font-bold tracking-widest text-slate-300 text-center">
              {data.personal.professionalTitle || 'Your Professional Title'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="relative z-10 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{ backgroundColor: activeColor.accentHex }}
              >
                <Phone size={13} className="stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h3 
                  className="text-[12.5px] font-black tracking-wider uppercase transition-colors duration-200"
                  style={{ color: activeColor.accentHex }}
                >
                  Contact
                </h3>
                <div className="h-0 border-t border-slate-700 w-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-3.5 pl-0.5">
              {data.personal.email && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>Email</p>
                  <p className="text-[11px] text-slate-200 font-medium break-all">{data.personal.email}</p>
                </div>
              )}
              {data.personal.phone && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>Phone</p>
                  <p className="text-[11px] text-slate-200 font-medium">{data.personal.phone}</p>
                </div>
              )}
              {data.personal.location && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>Location</p>
                  <p className="text-[11px] text-slate-200 font-medium">{data.personal.location}</p>
                </div>
              )}
              {data.personal.portfolio && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>Website</p>
                  <p className="text-[11px] text-slate-200 font-medium break-all underline decoration-slate-600 hover:text-white">
                    {data.personal.portfolio.replace('https://', '')}
                  </p>
                </div>
              )}
              {data.personal.linkedin && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>LinkedIn</p>
                  <p className="text-[11px] text-slate-200 font-medium break-all underline decoration-slate-600 hover:text-white">
                    {data.personal.linkedin.replace('https://', '').replace('linkedin.com/in/', '')}
                  </p>
                </div>
              )}
              {data.personal.github && (
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200" style={{ color: activeColor.accentHex }}>GitHub</p>
                  <p className="text-[11px] text-slate-200 font-medium break-all underline decoration-slate-600 hover:text-white">
                    {data.personal.github.replace('https://', '').replace('github.com/', '')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Skills with Progress Bars */}
          {data.skills.filter(s => s.category === 'technical').length > 0 && (
            <div className="relative z-10 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Award size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-[12.5px] font-black tracking-wider uppercase transition-colors duration-200"
                    style={{ color: activeColor.accentHex }}
                  >
                    Skills
                  </h3>
                  <div className="h-0 border-t border-slate-700 w-full mt-1"></div>
                </div>
              </div>

              <div className="space-y-3.5 pl-0.5 mt-2">
                {data.skills.filter(s => s.category === 'technical').slice(0, 6).map((s) => {
                  const levelVal = ((s.name.charCodeAt(0) + s.name.length) % 4) * 8 + 72;
                  return (
                    <div key={s.id} className="space-y-1">
                      <span className="text-[10.5px] font-semibold text-slate-200 uppercase tracking-wider block">{s.name}</span>
                      <div className="w-full bg-slate-800 h-[6.5px] rounded-full overflow-hidden font-sans">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ width: `${levelVal}%`, backgroundColor: activeColor.accentHex }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests (Soft Skills) representation */}
          {data.skills.filter(s => s.category === 'soft').length > 0 && (
            <div className="relative z-10 mt-8 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Heart size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-[12.5px] font-black tracking-wider uppercase transition-colors duration-200"
                    style={{ color: activeColor.accentHex }}
                  >
                    Interests
                  </h3>
                  <div className="h-0 border-t border-slate-700 w-full mt-1"></div>
                </div>
              </div>

              <ul className="space-y-2 pl-2 text-[11px] text-slate-250 font-medium leading-relaxed font-sans">
                {data.skills.filter(s => s.category === 'soft').slice(0, 5).map((s) => (
                  <li key={s.id} className="list-disc" style={{ contentVisibility: 'auto' }}>
                    <span style={{ color: activeColor.accentHex, marginRight: '4px' }}>•</span> {s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column (Pure Crisp White Board) */}
        <div className="flex-1 bg-white p-7 md:p-11 print:p-5 flex flex-col space-y-6 print:space-y-3.5">
          
          {/* PROFILE / SUMMARY */}
          {data.personal.summary && (
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <User size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Profile</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify pl-1 select-text">
                {data.personal.summary}
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {regularJobs.length > 0 && data.showExperience !== false && (
            <div>
              <div className="flex items-center gap-3 mb-4.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Briefcase size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Experience</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-0.5 select-text">
                {regularJobs.map((exp) => (
                  <div key={exp.id} className="relative pl-6 pb-4.5 last:pb-1 border-l border-slate-200">
                    {/* Dynamic pin node */}
                    <div 
                      className="absolute top-[4.5px] -left-[5px] w-2.5 h-2.5 rounded-full border border-white shrink-0 shadow-sm transition-colors duration-200"
                      style={{ backgroundColor: activeColor.accentHex }}
                    ></div>
                    
                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-extrabold text-slate-955 leading-tight uppercase">
                        {exp.position}
                      </h4>
                      <div className="text-[11px] font-bold text-slate-500 flex justify-between items-baseline flex-wrap gap-1 font-sans">
                        <span>{exp.company}</span>
                        <span className="font-semibold text-slate-400 font-mono text-[9.5px] shrink-0">
                          {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      
                      <div className="pt-1 select-text">
                        {renderDescriptionBullets(exp.description, false)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERNSHIPS (Dynamic subsection mapping) */}
          {internships.length > 0 && data.showInternships !== false && (
            <div>
              <div className="flex items-center gap-3 mb-4.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Briefcase size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Internship Experience</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-0.5 select-text">
                {internships.map((exp) => (
                  <div key={exp.id} className="relative pl-6 pb-4.5 last:pb-1 border-l border-slate-200">
                    <div 
                      className="absolute top-[4.5px] -left-[5px] w-2.5 h-2.5 rounded-full border border-white shrink-0 shadow-sm transition-colors duration-200"
                      style={{ backgroundColor: activeColor.accentHex }}
                    ></div>
                    
                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-extrabold text-slate-955 leading-tight uppercase">
                        {exp.position}
                      </h4>
                      <div className="text-[11px] font-bold text-slate-500 flex justify-between items-baseline flex-wrap gap-1 font-sans">
                        <span>{exp.company}</span>
                        <span className="font-semibold text-slate-400 font-mono text-[9.5px] shrink-0">
                          {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      
                      <div className="pt-1 select-text">
                        {renderDescriptionBullets(exp.description, false)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESEARCH */}
          {research.length > 0 && data.showResearch !== false && (
            <div>
              <div className="flex items-center gap-3 mb-4.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Lightbulb size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Research Experience</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-0.5 select-text">
                {research.map((exp) => (
                  <div key={exp.id} className="relative pl-6 pb-4.5 last:pb-1 border-l border-slate-200">
                    <div 
                      className="absolute top-[4.5px] -left-[5px] w-2.5 h-2.5 rounded-full border border-white shrink-0 shadow-sm transition-colors duration-200"
                      style={{ backgroundColor: activeColor.accentHex }}
                    ></div>
                    
                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-extrabold text-slate-955 leading-tight uppercase">
                        {exp.position}
                      </h4>
                      <div className="text-[11px] font-bold text-slate-500 flex justify-between items-baseline flex-wrap gap-1 font-sans font-medium text-slate-500">
                        <span>{exp.company || 'Institution'}</span>
                        <span className="font-semibold text-slate-400 font-mono text-[9.5px] shrink-0">
                          {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      
                      <div className="pt-1 select-text">
                        {renderDescriptionBullets(exp.description, false)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADERSHIP */}
          {leadership.length > 0 && data.showLeadership !== false && (
            <div>
              <div className="flex items-center gap-3 mb-4.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Users size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Leadership & Service</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-0.5 select-text">
                {leadership.map((exp) => (
                  <div key={exp.id} className="relative pl-6 pb-4.5 last:pb-1 border-l border-slate-200">
                    <div 
                      className="absolute top-[4.5px] -left-[5px] w-2.5 h-2.5 rounded-full border border-white shrink-0 shadow-sm transition-colors duration-200"
                      style={{ backgroundColor: activeColor.accentHex }}
                    ></div>
                    
                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-extrabold text-slate-955 leading-tight uppercase">
                        {exp.position}
                      </h4>
                      <div className="text-[11px] font-bold text-slate-500 flex justify-between items-baseline flex-wrap gap-1 font-sans">
                        <span>{exp.company || 'Organization'}</span>
                        <span className="font-semibold text-slate-400 font-mono text-[9.5px] shrink-0">
                          {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      
                      <div className="pt-1 select-text">
                        {renderDescriptionBullets(exp.description, false)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <GraduationCap size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Education</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-4 select-text">
                {data.education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 animate-in">
                    <h4 className="text-[12px] font-extrabold text-slate-955 uppercase leading-snug">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h4>
                    <div className="text-[10.5px] font-bold text-slate-500 flex justify-between items-baseline flex-wrap gap-1 font-sans">
                      <span>{edu.institution}</span>
                      <span className="font-semibold text-slate-400 font-mono text-[9.5px] shrink-0">{edu.graduationDate}</span>
                    </div>
                    {edu.gpa && <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">GPA/Result: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS (Replaced Heading "Portfolio" with "Projects") */}
          {data.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <BookOpen size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Projects</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <div className="pl-1 space-y-4 select-text">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <h4 className="text-[12px] font-extrabold text-slate-955 uppercase tracking-tight font-sans">
                      {proj.title}
                      {proj.link && (
                        <span className="text-[10px] text-blue-600 font-bold ml-1.5 lowercase hover:underline font-mono">
                          ({proj.link.replace('https://', '')})
                        </span>
                      )}
                    </h4>
                    <div className="text-[11px] leading-relaxed text-slate-705 text-justify">
                      {renderDescriptionBullets(proj.description, false)}
                    </div>
                    {proj.technologies && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        <span className="font-semibold text-slate-650 uppercase text-[9px] mr-1 font-sans">Technologies:</span> {proj.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS (Keep at last of right column too with adaptive coloring!) */}
          {data.skills.filter(s => s.category === 'other').length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div 
                  className="w-7 h-7 rounded-full text-[#1e293b] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
                  style={{ backgroundColor: activeColor.accentHex }}
                >
                  <Award size={13} className="stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[13px] font-black tracking-wider text-slate-900 uppercase">Certifications</h2>
                  <div className="h-0 border-t border-slate-200 w-full mt-1.5"></div>
                </div>
              </div>

              <ul className="pl-1.5 space-y-1.5 list-none select-text">
                {data.skills.filter(s => s.category === 'other').map((s) => (
                  <li key={s.id} className="relative pl-4 text-[11px] leading-relaxed text-slate-750 text-justify font-sans">
                    <span 
                      className="absolute left-0 top-[7.5px] w-[4px] h-[4px] rounded-full transition-colors duration-200"
                      style={{ backgroundColor: activeColor.accentHex }}
                    ></span>
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. Apply Abroad Template (The Ultimate 1-Column ATS Optimal Standard)
  const renderApplyAbroad = () => {
    const { regularJobs, internships, research, leadership } = getGroupedExperience();

    return (
      <div className="font-sans text-slate-900 space-y-4.5 max-w-full leading-tight p-10 md:p-14 bg-white text-[11px] select-text">
        {/* ATS-Compliant Plain-text Optimized Header */}
        <div className="text-center space-y-1.5 pb-2 border-b-2 border-slate-900 font-sans">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">{data.personal.name || 'Your Name'}</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-650">
            {data.personal.professionalTitle || 'Your Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[10.5px] font-mono text-slate-700 pt-0.5">
            {data.personal.email && <span className="uppercase">Email: {data.personal.email}</span>}
            {data.personal.phone && <span>| TEL: {data.personal.phone}</span>}
            {data.personal.location && <span>| ADD: {data.personal.location}</span>}
            {data.personal.portfolio && <span className="underline">| PORTFOLIO: {data.personal.portfolio.replace('https://', '')}</span>}
            {data.personal.github && <span className="underline">| GITHUB: {data.personal.github.replace('https://github.com/', '')}</span>}
            {data.personal.linkedin && <span className="underline">| LINKEDIN: {data.personal.linkedin.replace('https://linkedin.com/in/', '')}</span>}
          </div>
        </div>

        {/* 1. Education Section (Always at the very top for Academic / Apply Abroad track!) */}
        {data.education.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mt-1 font-sans">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-950">
                    <span className="font-bold text-[11px]">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                    <span className="font-mono text-slate-600 text-[10px] font-normal">{edu.graduationDate}</span>
                  </div>
                  <div className="italic text-slate-800 text-[10.5px] flex justify-between">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    {edu.gpa && <span className="font-mono not-italic font-bold text-slate-700">{edu.gpa}</span>}
                  </div>
                  {edu.minors && (
                    <div className="text-[10px] text-slate-750 font-sans">
                      <span className="font-bold text-slate-900 uppercase text-[9px] mr-1">Minors:</span>
                      {edu.minors}
                    </div>
                  )}
                  {edu.honors && (
                    <div className="text-[10px] text-slate-750 font-sans">
                      <span className="font-bold text-slate-900 uppercase text-[9px] mr-1">Honors:</span>
                      {edu.honors}
                    </div>
                  )}
                  {edu.coursework && (
                    <div className="text-[10px] text-slate-700 font-mono leading-relaxed mt-0.5">
                      <span className="font-bold text-slate-900 uppercase text-[8.5px] font-sans mr-1">Relevant Coursework:</span>
                      {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATS-Style Professional Summary */}
        {data.personal.summary && (
          <div className="space-y-1">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mt-1 font-sans">Professional Summary</h2>
            <p className="text-[10.5px] leading-relaxed text-slate-805 text-justify pt-0.5 font-sans">{data.personal.summary}</p>
          </div>
        )}

        {/* 2. Professional Work Experience Section */}
        {regularJobs.length > 0 && data.showExperience !== false && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Work Experiences</h2>
            <div className="space-y-4">
              {regularJobs.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-slate-955">
                    <span className="font-bold text-[11px] text-slate-950">
                      {exp.position}{exp.company ? `, ${exp.company}` : ''}{exp.location ? ` – ${exp.location}` : ''}
                    </span>
                    <span className="font-mono text-slate-600 text-[9.5px] font-normal tracking-tight">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 leading-relaxed text-[10.5px]">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Internship Experiences Section */}
        {internships.length > 0 && data.showInternships !== false && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Internships</h2>
            <div className="space-y-4">
              {internships.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-slate-955">
                    <span className="font-bold text-[11px] text-slate-950">
                      {exp.position}{exp.company ? `, ${exp.company}` : ''}{exp.location ? ` – ${exp.location}` : ''}
                    </span>
                    <span className="font-mono text-slate-600 text-[9.5px] font-normal tracking-tight">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 leading-relaxed text-[10.5px]">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Research Experience Section */}
        {research.length > 0 && data.showResearch !== false && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Research Experience</h2>
            <div className="space-y-4">
              {research.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-slate-955">
                    <span className="font-bold text-[11px] text-slate-950">
                      {exp.position}{exp.company ? `, ${exp.company}` : ''}{exp.location ? ` – ${exp.location}` : ''}
                    </span>
                    <span className="font-mono text-slate-600 text-[9.5px] font-normal tracking-tight">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 leading-relaxed text-[10.5px]">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Leadership Experiences Section */}
        {leadership.length > 0 && data.showLeadership !== false && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Leadership Experiences</h2>
            <div className="space-y-4">
              {leadership.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-slate-955">
                    <span className="font-bold text-[11px] text-slate-950">
                      {exp.position}{exp.company ? `, ${exp.company}` : ''}{exp.location ? ` – ${exp.location}` : ''}
                    </span>
                    <span className="font-mono text-slate-600 text-[9.5px] font-normal tracking-tight">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 leading-relaxed text-[10.5px]">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Creative Projects Section */}
        {data.projects.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Creative Projects</h2>
            <div className="space-y-3.5">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="font-bold text-[11px] text-slate-950">{proj.title}</span>
                    {proj.link && <span className="text-[9.5px] font-mono text-slate-600 font-normal lowercase">{proj.link}</span>}
                  </div>
                  {proj.technologies && (
                    <div className="text-[9.5px] font-sans text-slate-800 font-semibold tracking-wide">
                      {proj.technologies}
                    </div>
                  )}
                  <div className="text-[10.5px] leading-relaxed">
                    {renderDescriptionBullets(proj.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Publication & Presentations Section */}
        {data.publications && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Publication & Presentation</h2>
            <div className="text-[10.5px] leading-relaxed text-slate-850 text-justify">
              {renderDescriptionBullets(data.publications, false)}
            </div>
          </div>
        )}

        {/* 8. Core Skills Section */}
        {data.skills.filter(s => s.category !== 'other').length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-955 border-b border-slate-900 pb-0.5 mt-1 font-sans">Skills</h2>
            <div className="space-y-1 leading-relaxed text-[10.5px]">
              {data.skills.filter(s => s.category === 'technical').length > 0 && (
                <div className="text-slate-800 text-justify">
                  <span className="font-bold text-slate-950 mr-1 font-sans">Technical Skills:</span>
                  {data.skills.filter(s => s.category === 'technical').map(s => s.name).join(', ')}
                </div>
              )}
              {data.skills.filter(s => s.category === 'soft').length > 0 && (
                <div className="text-slate-800 text-justify">
                  <span className="font-bold text-slate-950 mr-1 font-sans">Information Technology:</span>
                  {data.skills.filter(s => s.category === 'soft').map(s => s.name).join(', ')}
                </div>
              )}
              {data.skills.filter(s => s.category === 'other').length > 0 && (
                <div className="text-slate-800 text-justify">
                  <span className="font-bold text-slate-950 mr-1 font-sans">Data Analytics:</span>
                  {data.skills.filter(s => s.category === 'other').map(s => s.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. Honors & Awards Section */}
        {data.honorsAndAwards && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mt-1 font-sans">Honors & Awards</h2>
            <div className="text-[10.5px] leading-relaxed text-slate-850 text-justify">
              {renderDescriptionBullets(data.honorsAndAwards, false)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. Campus Placement Template (The Classic Comprehensive Academic Grid)
  const renderCampusPlacement = () => {
    const { regularJobs, internships, research, leadership } = getGroupedExperience();

    return (
      <div className="font-sans text-slate-950 space-y-5 max-w-full leading-snug p-10 md:p-12 bg-white text-[11px] select-text animate-in">
        {/* Name and Designation: Split Layout for Photo support */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-3 border-b border-black">
          {/* Candidate Details */}
          <div className="flex-1 space-y-2 text-center sm:text-left w-full">
            <h1 className="text-3.5xl font-black tracking-tight text-black uppercase leading-none">{data.personal.name || 'Candidate Name'}</h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${getAccentTextClass()}`}>
              {data.personal.professionalTitle || 'Graduate Trainee / Candidate'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-[10.5px] font-mono text-slate-800">
              {data.personal.email && <span className="hover:underline text-[10px] font-semibold">{data.personal.email}</span>}
              <span>•</span>
              {data.personal.phone && <span className="text-[10px] font-semibold">{data.personal.phone}</span>}
              <span>•</span>
              {data.personal.location && <span className="text-[10px] font-semibold">{data.personal.location}</span>}
              {data.personal.portfolio && (
                <>
                  <span>•</span>
                  <span className="underline font-semibold">{data.personal.portfolio.replace('https://', '')}</span>
                </>
              )}
              {data.personal.github && (
                <>
                  <span>•</span>
                  <span className="underline font-semibold font-mono text-[9.5px]">github:{data.personal.github.replace('https://github.com/', '')}</span>
                </>
              )}
              {data.personal.linkedin && (
                <>
                  <span>•</span>
                  <span className="underline font-bold text-slate-900 font-mono text-[9.5px]">linkedin:{data.personal.linkedin.replace('https://linkedin.com/in/', '')}</span>
                </>
              )}
            </div>
          </div>

          {/* Optional Profile Photo right-aligned */}
          <div className="relative shrink-0">
            {data.personal.photo ? (
              <img
                src={data.personal.photo}
                alt={data.personal.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-slate-300 shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-2 text-[8px] text-slate-400">
                <span>Passport Photo</span>
                <span className="font-bold text-base mt-0.5 text-slate-500 font-sans">
                  {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('') : 'AV'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Objective Summary */}
        {data.personal.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Profile Objective Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-800 text-justify font-sans pt-0.5">{data.personal.summary}</p>
          </div>
        )}

        {/* Academic Qualifications Table */}
        {data.education.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Academic Qualifications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300 font-mono text-[10px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-950 border-b border-slate-300">
                    <th className="p-1.5 border border-slate-300 font-bold uppercase font-sans">Degree / Course</th>
                    <th className="p-1.5 border border-slate-300 font-bold uppercase font-sans">Institution / Board</th>
                    <th className="p-1.5 border border-slate-300 font-bold uppercase font-sans">Graduation Year</th>
                    <th className="p-1.5 border border-slate-300 font-bold uppercase text-right font-sans">GPA / %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.education.map((edu) => (
                    <tr key={edu.id} className="border-b border-slate-200">
                      <td className="p-1.5 border border-slate-300 font-extrabold text-slate-950 font-sans">{edu.degree}</td>
                      <td className="p-1.5 border border-slate-300 font-sans">{edu.institution} ({edu.fieldOfStudy})</td>
                      <td className="p-1.5 border border-slate-300 font-mono">{edu.graduationDate}</td>
                      <td className={`p-1.5 border border-slate-300 font-black text-right font-sans ${getAccentTextClass()}`}>{edu.gpa || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Professional Experience & Internships */}
        {regularJobs.length > 0 && data.showExperience !== false && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {regularJobs.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline font-sans">
                    <div>
                      <span className="font-extrabold text-black text-[11.5px]">{exp.position}</span>
                      <span className="text-slate-650 font-bold"> • {exp.company}</span>
                    </div>
                    <span className="font-semibold text-slate-600 font-mono text-[10px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="pl-2 border-l border-slate-300">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships section */}
        {internships.length > 0 && data.showInternships !== false && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Graduate Internships & Industry Training
            </h2>
            <div className="space-y-3">
              {internships.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline font-sans">
                    <div>
                      <span className="font-extrabold text-black text-[11.5px]">{exp.position}</span>
                      <span className="text-slate-650 font-bold"> • {exp.company}</span>
                    </div>
                    <span className="font-semibold text-slate-600 font-mono text-[10px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="pl-2 border-l border-slate-300">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research section */}
        {research.length > 0 && data.showResearch !== false && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Research & Academic Projects
            </h2>
            <div className="space-y-3">
              {research.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline font-sans">
                    <div>
                      <span className="font-extrabold text-black text-[11.5px]">{exp.position}</span>
                      <span className="text-slate-650 font-bold"> • {exp.company || 'Institution'}</span>
                    </div>
                    <span className="font-semibold text-slate-600 font-mono text-[10px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="pl-2 border-l border-slate-300">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership section */}
        {leadership.length > 0 && data.showLeadership !== false && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Leadership & Campus Activities
            </h2>
            <div className="space-y-3">
              {leadership.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline font-sans">
                    <div>
                      <span className="font-extrabold text-black text-[11.5px]">{exp.position}</span>
                      <span className="text-slate-650 font-bold"> • {exp.company || 'Organization'}</span>
                    </div>
                    <span className="font-semibold text-slate-600 font-mono text-[10px] shrink-0">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="pl-2 border-l border-slate-300">
                    {renderDescriptionBullets(exp.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placement Projects & Hackathons */}
        {data.projects.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Placement Projects & Academic Hackathons
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline font-bold font-sans">
                    <div className="text-black font-sans font-bold text-[11.5px]">
                      {proj.title}
                      {proj.technologies && <span className="font-normal font-mono text-[9px] text-slate-500 ml-2 border border-slate-250 bg-slate-50 rounded px-1.5 py-[1px]">{proj.technologies}</span>}
                    </div>
                    {proj.link && <span className="text-[10px] text-indigo-700 font-normal hover:underline lowercase font-mono shrink-0">{proj.link.replace('https://', '')}</span>}
                  </div>
                  <div className="pl-2 border-l border-slate-300">
                    {renderDescriptionBullets(proj.description, false)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Inventory */}
        {data.skills.filter(s => s.category !== 'other').length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Placement Skills & Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 leading-snug font-sans pl-1">
              {data.skills.filter(s => s.category === 'technical').length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wide block">Tech Stack, Skills & Tools:</span>
                  <p className="text-slate-800 leading-normal text-xs font-sans mt-0.5">
                    {data.skills.filter(s => s.category === 'technical').map(s => s.name).join(', ') || 'N/A'}
                  </p>
                </div>
              )}
              {data.skills.filter(s => s.category === 'soft').length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wide block">Domain Expertises & Soft Traits:</span>
                  <p className="text-slate-800 leading-normal text-xs font-sans mt-0.5">
                    {data.skills.filter(s => s.category === 'soft').map(s => s.name).join(', ') || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Extra Certifications list on academic template */}
        {data.skills.filter(s => s.category === 'other').length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide border-b border-black pb-0.5 text-black font-sans">
              Licensure Certifications & Credentials
            </h2>
            <ul className="space-y-1 pl-1.5 list-none font-mono text-[10.5px]">
              {data.skills.filter(s => s.category === 'other').map((s) => (
                <li key={s.id} className="relative pl-3.5 text-slate-800">
                  <span className="absolute left-0 top-[6px] w-[3.5px] h-[3.5px] rounded-full bg-black"></span>
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  const renderPersonalFavourite = () => {
    // Helper to dynamically match rule color to selected accent (using borders to guarantee print visibility)
    const getDividerBorderClass = () => {
      switch (accentColor) {
        case 'indigo': return 'border-indigo-600';
        case 'emerald': return 'border-emerald-600';
        case 'rose': return 'border-rose-600';
        case 'amber': return 'border-amber-500';
        case 'slate': return 'border-slate-800';
        default: return 'border-indigo-600';
      }
    };

    // Helper to render section title with beautiful custom rule divider (headings & spacing reduced)
    const renderSectionHeader = (title: string) => {
      return (
        <div className="mt-6 first:mt-0 font-sans">
          <h2 className="text-[11.5px] font-black tracking-wider text-slate-1000 uppercase leading-none">{title}</h2>
          <div className={`section-divider h-0 border-b-[1.5px] ${getDividerBorderClass()} w-full mt-0.5 mb-2 transition-all duration-200`}></div>
        </div>
      );
    };

    // Helper to render simple, accurate dot-bullets with tight line gaps
    const renderPersonalBullets = (text: string) => {
      if (!text) return null;
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
        
      return (
        <ul className="space-y-0.5 pl-1 list-none font-sans select-text">
          {lines.map((line, idx) => {
            const cleaned = line.replace(/^[•\-\*\u2022\u2043\u25E6⁃]\s*/, '').trim();
            if (!cleaned) return null;
            return (
              <li key={idx} className="relative pl-3.5 text-[10.5px] leading-snug text-slate-800 text-justify">
                <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                {cleaned}
              </li>
            );
          })}
        </ul>
      );
    };

    const { regularJobs, internships, research, leadership } = getGroupedExperience();

    return (
      <div className={`personal-favourite-container accent-${accentColor} font-sans text-slate-900 space-y-4.5 max-w-full leading-normal p-8 md:p-10 bg-white select-text text-left`}>
        {/* Header - Aligned Name and floating right Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-1">
          {/* Invisible Spacer left to balance photo on desktop for absolute heading center-alignment */}
          <div className="hidden sm:block w-24"></div>

          <div className="flex-1 text-center space-y-0.5">
            <h1 className="text-[23px] font-black tracking-normal text-slate-955 uppercase leading-none">{data.personal.name || 'Your Name'}</h1>
            <p className="text-[11px] text-slate-850 font-semibold">{data.personal.location || 'Your Location'}</p>
            <div className="text-[10px] text-slate-800 flex flex-wrap justify-center items-center gap-x-1 font-medium">
              {data.personal.phone && <span>Phone: {data.personal.phone} |</span>}
              {data.personal.email && <span>Email: <span className="text-blue-600 hover:underline">{data.personal.email}</span> |</span>}
            </div>
            <div className="text-[9.5px] text-slate-800 flex flex-wrap justify-center items-center gap-x-1.5 pt-0.5">
              {data.personal.linkedin && (
                <span>LinkedIn: <span className="text-blue-600 hover:underline">{data.personal.linkedin.replace('https://', '')}</span></span>
              )}
              {data.personal.linkedin && data.personal.github && <span>|</span>}
              {data.personal.github && (
                <span>GitHub: <span className="text-blue-600 hover:underline">{data.personal.github.replace('https://', '')}</span></span>
              )}
            </div>
          </div>

          {/* Picture frame right-aligned exactly as PDF */}
          <div className="relative shrink-0">
            {data.personal.photo ? (
              <img
                src={data.personal.photo}
                alt={data.personal.name}
                className="w-20 h-20 rounded-full object-cover border border-slate-300 shadow-xs pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-1 text-[8px] text-slate-400 select-none">
                <span>Photo</span>
                <span className="font-bold text-xs text-slate-500">
                  {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('') : 'AV'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 1. SUMMARY */}
        {data.personal.summary && (
          <div className="animate-in fade-in">
            {renderSectionHeader('SUMMARY')}
            <p className="text-[10.5px] leading-relaxed text-slate-850 text-justify">{data.personal.summary}</p>
          </div>
        )}

        {/* 2. EDUCATION */}
        {data.education.length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('EDUCATION')}
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-0.5 text-[10.8px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-950">
                    <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="font-mono text-slate-600 font-semibold text-[9.5px]">{edu.graduationDate}</span>
                  </div>
                  <div className="text-slate-800 flex justify-between">
                    <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                    {edu.gpa && <span className="font-bold font-mono text-[9.5px]">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.minors && (
                    <p className="text-[9.5px] text-slate-700">
                      <span className="font-bold uppercase text-[8.5px] mr-1">Minors:</span>{edu.minors}
                    </p>
                  )}
                  {edu.honors && (
                    <p className="text-[9.5px] text-slate-705">
                      <span className="font-bold uppercase text-[8.5px] mr-1">Honors:</span>{edu.honors}
                    </p>
                  )}
                  {edu.coursework && (
                    <p className="text-[9.5px] text-slate-650 font-mono">
                      <span className="font-bold uppercase text-[8.5px] font-sans mr-1">Coursework:</span>{edu.coursework}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. WORK EXPERIENCE */}
        {regularJobs.length > 0 && data.showExperience !== false && (
          <div className="space-y-0.5">
            {renderSectionHeader('WORK EXPERIENCE')}
            <div className="space-y-2.5">
              {regularJobs.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[10.5px]">
                    <span className="font-extrabold text-slate-950 uppercase">{exp.company}</span>
                    <span className="font-semibold text-slate-650 font-mono text-[9.5px]">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="italic text-slate-850 font-bold text-[10px]">{exp.position}{exp.location ? ` (${exp.location})` : ''}</p>
                  {renderPersonalBullets(exp.description)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INTERNSHIPS */}
        {internships.length > 0 && data.showInternships !== false && (
          <div className="space-y-0.5">
            {renderSectionHeader('INTERNSHIPS')}
            <div className="space-y-2.5">
              {internships.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[10.5px]">
                    <span className="font-extrabold text-slate-950 uppercase">{exp.company}</span>
                    <span className="font-semibold text-slate-650 font-mono text-[9.5px]">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="italic text-slate-850 font-bold text-[10px]">{exp.position}{exp.location ? ` (${exp.location})` : ''}</p>
                  {renderPersonalBullets(exp.description)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. RESEARCH EXPERIENCE */}
        {research.length > 0 && data.showResearch !== false && (
          <div className="space-y-0.5">
            {renderSectionHeader('RESEARCH EXPERIENCE')}
            <div className="space-y-2.5">
              {research.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[10.5px]">
                    <span className="font-extrabold text-slate-950 uppercase">{exp.company}</span>
                    <span className="font-semibold text-slate-650 font-mono text-[9.5px]">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="italic text-slate-850 font-bold text-[10px]">{exp.position}{exp.location ? ` (${exp.location})` : ''}</p>
                  {renderPersonalBullets(exp.description)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. LEADERSHIP EXPERIENCE */}
        {leadership.length > 0 && data.showLeadership !== false && (
          <div className="space-y-0.5">
            {renderSectionHeader('LEADERSHIP & SERVICE')}
            <div className="space-y-2.5">
              {leadership.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[10.5px]">
                    <span className="font-extrabold text-slate-950 uppercase">{exp.company}</span>
                    <span className="font-semibold text-slate-650 font-mono text-[9.5px]">
                      {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="italic text-slate-850 font-bold text-[10px]">{exp.position}{exp.location ? ` (${exp.location})` : ''}</p>
                  {renderPersonalBullets(exp.description)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TECHNICAL SKILLS */}
        {data.skills.filter(s => s.category !== 'other').length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('TECHNICAL SKILLS')}
            <ul className="space-y-0.5 pl-1 list-none font-sans">
              {(() => {
                const colonSkills = data.skills.filter(s => s.name.includes(':'));
                if (colonSkills.length > 0) {
                  return colonSkills.map((s) => (
                    <li key={s.id} className="relative pl-3.5 text-[10.5px] leading-snug text-slate-800">
                      <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                      <span className="font-bold">{s.name.split(':')[0]}:</span> {s.name.split(':').slice(1).join(':')}
                    </li>
                  ));
                }
                
                const techSkills = data.skills.filter(s => s.category === 'technical');
                const softSkills = data.skills.filter(s => s.category === 'soft');
                const items = [];
                if (techSkills.length > 0) {
                  items.push(
                    <li key="tech" className="relative pl-3.5 text-[10.5px] leading-snug text-slate-800 font-sans">
                      <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                      <span className="font-bold uppercase text-[9px]">Technical Stack:</span> {techSkills.map(s => s.name).join(', ')}
                    </li>
                  );
                }
                if (softSkills.length > 0) {
                  items.push(
                    <li key="soft" className="relative pl-3.5 text-[10.5px] leading-snug text-slate-800 font-sans">
                      <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                      <span className="font-bold uppercase text-[9px]">Information Technology:</span> {softSkills.map(s => s.name).join(', ')}
                    </li>
                  );
                }
                return items;
              })()}
            </ul>
          </div>
        )}

        {/* 8. PROJECTS */}
        {data.projects.length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('PROJECTS')}
            <div className="space-y-2">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5 font-sans">
                  <p className="font-bold text-slate-950 text-[11px] uppercase">
                    {proj.title}
                    {proj.link && (
                      <span className="text-[9px] text-blue-600 font-normal ml-2 hover:underline lowercase font-mono">
                        ({proj.link.replace('https://', '')})
                      </span>
                    )}
                  </p>
                  {renderPersonalBullets(proj.description)}
                  {proj.technologies && (
                    <ul className="pl-1 list-none mt-0.5">
                      <li className="relative pl-3.5 text-[10px] leading-snug text-slate-800">
                        <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                        <span className="font-semibold text-slate-900 uppercase text-[8.5px] mr-1">Technologies Used:</span> {proj.technologies}
                      </li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. PUBLICATIONS & PRESENTATIONS */}
        {data.publications && (
          <div className="space-y-0.5">
            {renderSectionHeader('PUBLICATIONS & PRESENTATIONS')}
            <div className="text-[10.5px] leading-relaxed text-slate-850 text-justify">
              {renderPersonalBullets(data.publications)}
            </div>
          </div>
        )}

        {/* 10. HONORS & AWARDS */}
        {data.honorsAndAwards && (
          <div className="space-y-0.5">
            {renderSectionHeader('HONORS & AWARDS')}
            <div className="text-[10.5px] leading-relaxed text-slate-850 text-justify">
              {renderPersonalBullets(data.honorsAndAwards)}
            </div>
          </div>
        )}

        {/* 11. CERTIFICATIONS */}
        {data.skills.filter(s => s.category === 'other').length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('CERTIFICATIONS & LICENSING')}
            <ul className="space-y-0.5 pl-1 list-none font-sans">
              {data.skills.filter(s => s.category === 'other').map((s) => (
                <li key={s.id} className="relative pl-3.5 text-[10.5px] leading-snug text-slate-800">
                  <span className="absolute left-0 top-[6.5px] w-[3px] h-[3px] rounded-full bg-slate-950"></span>
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTemplateContent = () => {
    switch (template) {
      case 'personal_favourite': return renderPersonalFavourite();
      case 'campus_placement': return renderCampusPlacement();
      case 'modern_resume': return renderModernResume();
      case 'apply_abroad': return renderApplyAbroad();
      case 'classic_corporate': return renderClassicCorporate();
    }
  };

  return (
    <div id="print-resume-canvas" className="w-full relative shadow-lg rounded-xl border border-slate-200 bg-white overflow-hidden self-start print:shadow-none print:rounded-none print:border-none print:bg-white print:w-full">
      {/* Visual Controls ribbon - hidden during print */}
      <div className="print:hidden w-full bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getAccentBorderClass().replace('border', 'bg')}`}></div>
          <span className="text-slate-500 font-medium font-sans">
            Style: <strong className="text-slate-800 uppercase font-mono tracking-tight text-[11px]">{template.replace('_', ' ')}</strong>
          </span>
        </div>
        <button
          id="print-trigger-btn"
          onClick={handlePrint}
          className="flex items-center gap-1.5 font-bold text-slate-700 bg-white border border-slate-300 rounded-md py-1 px-3 hover:bg-slate-50 active:bg-slate-100 transition shadow-sm font-sans cursor-pointer"
        >
          <Printer size={13} />
          Print / PDF Export
        </button>
      </div>

      {/* Render selected style template */}
      <div className="w-full overflow-x-auto min-h-[600px] print:overflow-visible print:min-h-0">
        <div className="relative min-w-[320px] print:min-w-0 print:w-full">
          {renderTemplateContent()}
        </div>
      </div>
    </div>
  );
}
