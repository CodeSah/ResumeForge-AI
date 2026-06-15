import { ResumeData } from '../types';

export const initialResumeData: ResumeData = {
  personal: {
    name: 'Alex Carter',
    professionalTitle: 'Senior Full Stack Engineer',
    email: 'alex.carter@careerdev.io',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    portfolio: 'https://alexcarter.dev',
    github: 'https://github.com/alexcarterdev',
    linkedin: 'https://linkedin.com/in/alexcarterdev',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
    summary: 'Driven and detail-oriented Full Stack Software Engineer with 5+ years of experience designing, building, and launching high-throughput modern web applications. Expert in React, TypeScript, Node.js, and cloud native architectures. Proven track record of optimizing platform performance, leading small engineering agile squads, and delivering fluid user experiences.'
  },
  experience: [
    {
      id: 'exp1',
      company: 'TechNova Solutions',
      position: 'Senior Software Engineer',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      description: '• Architected and migrated a monolithic frontend to a micro-frontend architecture using React & Tailwind CSS, improving core web vitals by 35%.\n• Coached and mentored 4 junior engineers, fostering agile practices and improving team speed velocity by 25%.\n• Engineered secure real-time collaboration dashboards using WebSockets and optimized queries, cutting database loads under peak stress by 40%.\n• Formulated automated CI/CD deployment pipelines on GCP, lowering production deployment failures by 80%.'
    },
    {
      id: 'exp2',
      company: 'PixelForge Studios',
      position: 'Full Stack Developer',
      startDate: '2021-06',
      endDate: '2022-12',
      current: false,
      description: '• Implemented over 45 responsive, accessible user interfaces using React, Next.js, and TypeScript, exceeding accessibility guidelines.\n• Collaborated with product leaders and UX designers to deploy a high-converting automated payment flow using Stripe, boosting subscriber retention by 15%.\n• Maintained and optimized Node.js microservices with Express and Redis caching, leading to a 200ms drop in average API response latency.'
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      graduationDate: '2021-05',
      gpa: '3.82 / 4.00'
    }
  ],
  projects: [
    {
      id: 'proj1',
      title: 'DevScale CRM Platform',
      description: 'A responsive open-source customer relationship index designed for rapid engineering teams. Built with React, Tailwind, and Node.js.',
      technologies: 'React, Tailwind, Express, SQLite, Git',
      link: 'https://github.com/alexcarterdev/devscale-crm'
    },
    {
      id: 'proj2',
      title: 'AutoQuant Trading Bot',
      description: 'A secure algorithmic utility executing and backtesting trading configurations. Features real-time charting and mock market testing.',
      technologies: 'Node.js, TypeScript, Recharts, WebSocket',
      link: 'https://github.com/alexcarterdev/autoquant-bot'
    }
  ],
  skills: [
    { id: 'sk1', name: 'TypeScript', category: 'technical' },
    { id: 'sk2', name: 'React', category: 'technical' },
    { id: 'sk3', name: 'Node.js', category: 'technical' },
    { id: 'sk4', name: 'Tailwind CSS', category: 'technical' },
    { id: 'sk5', name: 'Next.js', category: 'technical' },
    { id: 'sk6', name: 'Cloud Infrastructure (GCP)', category: 'technical' },
    { id: 'sk7', name: 'Express / REST APIs', category: 'technical' },
    { id: 'sk8', name: 'Git & Agile Scrum', category: 'technical' },
    { id: 'sk9', name: 'Collaboration & Leadership', category: 'soft' },
    { id: 'sk10', name: 'Empathetic Code Reviews', category: 'soft' },
    { id: 'sk11', name: 'Problem Solving', category: 'soft' }
  ]
};

export const sampleJobDescription = `Senior Full-Stack Engineer

Company: FutureFlow AI
Location: San Francisco / Remote

About the Role:
We are looking for a Senior Full-Stack Engineer to lead the creation of intelligent collaboration features on our AI SaaS. You will collaborate closely with product management and designers to architect high-performance React user interfaces and launch modern cloud services.

Requirements:
- 5+ years of professional experience building web applications with React, TypeScript, and modern styling frameworks (Tailwind, CSS modules).
- Strong experience with backend systems in Node.js / Express, PostgreSQL, or other SQL databases.
- Hands-on expertise with cloud-native applications on GCP or AWS, including container builds and structured CI/CD.
- Proven track record of optimizing client performance (Core Web Vitals).
- Excellent communications, empathetic engineering qualities, and comfortable mentoring junior devs.
- Solid understanding of WebSockets or other real-time data push mechanisms is a huge plus.`;
