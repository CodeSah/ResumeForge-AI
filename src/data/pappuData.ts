import { ResumeData } from '../types';

export const pappuJhaResumeData: ResumeData = {
  personal: {
    name: 'Pappu Jha',
    professionalTitle: 'IT Data Analyst & Research Assistant',
    email: 'jhapappu7165@gmail.com',
    phone: 'pappu.jha@usm.edu',
    location: 'Hattiesburg, MS',
    portfolio: 'https://scholar.google.com/citations?user=xyz', // placeholder for Scholar
    github: 'https://github.com/jhapappu',
    linkedin: 'https://linkedin.com/in/jhapappu',
    photo: '',
    summary: 'Detail-oriented and high-achieving Computer Science honors student with extensive experience in data analytics, process automation, and full-stack solutions. Proven core competency in Python, machine learning, and advanced dashboard builds. Track record of research publications, academic excellence awards, and campus leadership.'
  },
  experience: [
    {
      id: 'p_exp_1',
      company: 'Jones Capital',
      position: 'IT Data Analyst Intern',
      startDate: '2025-09',
      endDate: 'Present',
      current: true,
      type: 'job',
      location: 'Hattiesburg, MS',
      description: '• Designed and modified 10+ automation workflows in Jira Service Management (JSM) across over 8 portfolio companies, reducing service request resolution time by 25% and aligning delivery with SLA targets.\n• Built 30+ dynamic gadgets in JSM and Excel using JQL filters to monitor real-time performance of 5 IT agents, resulting in a 30% increase in team efficiency and improved KPI tracking.\n• Developed 5 automation pipelines in n8n, created 20+ pages of process documentation in Confluence, and published 5 Scribe tutorials, reducing manual reporting time by 40%.\n• Resolved 10+ field-level discrepancies in more than 2000 JSM work items of all time by troubleshooting, leading to a 100% reduction in recurring ticket errors in the following weeks.'
    },
    {
      id: 'p_exp_2',
      company: 'Institute for Advanced Analytics and Society',
      position: 'Data Analyst/Research Assistant',
      startDate: '2025-05',
      endDate: 'Present',
      current: true,
      type: 'job',
      location: 'Hattiesburg, MS',
      description: '• Built AQUAVIEW, a Python library exposing more than 7 API endpoints for streamlined access to oceanographic data for NOAA (National Oceanic and Atmospheric Administration), downloaded over 1000 times.\n• Processed 17M+ data from 125 years of the World Ocean Database, generated metadata in MongoDB, indexed in Cloud, and integrated into the UI via Elastic Search, contributing to the NOAA’s AQUAVIEW project.\n• Enhanced the user interface of World Ocean Database to handle edge cases, including invalid date ranges and out-of-bound latitude/longitude values, improving overall user experience.\n• Developed an LLM-powered classification tool to assign Platform IDs for Uncrewed Marine Systems using metadata in real-time, streamlining NOAA’s platform designation across 20M+ data points in 10+ sources.\n• Created an adapter for the National Data Buoy Center (NDBC) historical and real-time data from inactive and active stations, enabling easy access to over 30 years of NDBC datasets.'
    },
    {
      id: 'p_exp_3',
      company: 'Roy Howard Community Journalism Center',
      position: 'Web Developer',
      startDate: '2024-10',
      endDate: '2025-05',
      current: false,
      type: 'job',
      location: 'Hattiesburg, MS',
      description: '• Developed and maintained the organization’s content-heavy website using WordPress (SNO CMS), improving user engagement by 35% through targeted UI/UX redesign and responsive layouts.\n• Enhanced visibility by optimizing SEO metadata, improving page load speed by 40%, and indexing high-traffic pages on Google Search Console.\n• Collaborated with editorial and tech teams to ensure site performance, troubleshoot errors, and publish timely content updates, ensuring 99.9% uptime.'
    },
    {
      id: 'p_exp_4',
      company: 'Cyber Innovation Lab',
      position: 'Undergraduate Research Assistant (Volunteer)',
      startDate: '2024-09',
      endDate: 'Present',
      current: true,
      type: 'research',
      location: 'Hattiesburg, MS',
      description: '• Led two cybersecurity research projects using machine learning and deep learning in collaboration with faculty and mentors, resulting in a conference presentation, research award, and publication.'
    },
    {
      id: 'p_exp_5',
      company: 'The Entrepreneurship Society, USM Center for Entrepreneurship',
      position: 'Creative Director',
      startDate: '2025-08',
      endDate: 'Present',
      current: true,
      type: 'leadership',
      location: 'Hattiesburg, MS',
      description: '• Conducted marketing of the organization via social media, mass emailing, and distributing flyers, increasing the membership to more than 80 in a semester.'
    },
    {
      id: 'p_exp_6',
      company: 'USM Center for International Education',
      position: 'International Ambassador/Mentor',
      startDate: '2023-12',
      endDate: 'Present',
      current: true,
      type: 'leadership',
      location: 'Hattiesburg, MS',
      description: '• Supported 100+ international students by managing pre-arrival communication on Unibuddy and on-site onboarding to ensure a smooth transition to the United States.'
    },
    {
      id: 'p_exp_7',
      company: 'USM Residence Hall Association',
      position: 'Director of Finance',
      startDate: '2024-04',
      endDate: '2025-05',
      current: false,
      type: 'leadership',
      location: 'Hattiesburg, MS',
      description: '• Formulated budgets for 8+ RHA events with 1000+ attendees, coordinating with board members and advisors to ensure successful execution and efficient resource allocation.'
    }
  ],
  education: [
    {
      id: 'p_edu_1',
      institution: 'The University of Southern Mississippi (USM)',
      location: 'Hattiesburg, Mississippi',
      degree: 'Bachelor of Science (BS)',
      fieldOfStudy: 'Computer Science',
      graduationDate: 'Graduation: May 2027',
      gpa: 'GPA: 4.0/4.0',
      minors: 'Economic Data Analysis, Information Security',
      honors: 'Honors Keystone Scholar, TEDx Southern Miss 2025 Speaker',
      coursework: 'Designing Solutions for Defense, Data Structures & Algorithms, Econometrics, Machine Learning'
    }
  ],
  projects: [
    {
      id: 'p_proj_1',
      title: 'Boston Daddy',
      description: '• Developed a full-stack smart city infrastructure platform that integrated energy, traffic, and weather data — achieving predictive analytics and actionable insights for 15+ buildings and 10+ intersections in real-time.',
      technologies: 'Hack Harvard 2025, Harvard University',
      link: 'Link | Oct 2025'
    },
    {
      id: 'p_proj_2',
      title: 'Delagent',
      description: '• Built an AI-based scheduling platform using Fetch.AI uAgents framework, FastAPI, and SQLite, resulting in automated 3-agent calendar coordination and negotiation with 80% reduction in manual scheduling overhead.',
      technologies: 'MHacks 2025, University of Michigan',
      link: 'Link | Sept 2025'
    },
    {
      id: 'p_proj_3',
      title: 'Regulating College Dormitories Digitally Using C++',
      description: '• Built a dormitory management back-end system using all concepts from the introductory C++ course, streamlining student check-ins/outs and visitor logs, reducing manual tracking effort by 60%.\n• Integrated rule enforcement features to automatically flag dorm violations, improving housing compliance oversight of 500+ students.',
      technologies: 'Advisor: Mr. Rick Loggins, USM Faculty Member',
      link: 'Link | Nov 2023'
    }
  ],
  skills: [
    { id: 'p_sk_1', name: 'Python', category: 'technical' },
    { id: 'p_sk_2', name: 'C++', category: 'technical' },
    { id: 'p_sk_3', name: 'OOP', category: 'technical' },
    { id: 'p_sk_4', name: 'API', category: 'technical' },
    { id: 'p_sk_5', name: 'SQL', category: 'technical' },
    { id: 'p_sk_6', name: 'Web Development (HTML, CSS, JavaScript, WordPress)', category: 'technical' },
    { id: 'p_sk_7', name: 'Atlassian (Jira Service Management, Confluence)', category: 'soft' },
    { id: 'p_sk_8', name: 'n8n', category: 'soft' },
    { id: 'p_sk_9', name: 'Power BI', category: 'soft' },
    { id: 'p_sk_10', name: 'Scribe', category: 'soft' },
    { id: 'p_sk_11', name: 'Microsoft 365 tools', category: 'soft' },
    { id: 'p_sk_12', name: 'Cloud Services', category: 'soft' },
    { id: 'p_sk_13', name: 'GitHub', category: 'soft' },
    { id: 'p_sk_14', name: 'Database (MongoDB)', category: 'soft' },
    { id: 'p_sk_15', name: 'SharePoint', category: 'soft' },
    { id: 'p_sk_16', name: 'OneDrive', category: 'soft' },
    { id: 'p_sk_17', name: 'Jupyter Notebook', category: 'soft' },
    { id: 'p_sk_18', name: 'LLM/GenAI', category: 'soft' },
    { id: 'p_sk_19', name: 'NumPy', category: 'other' },
    { id: 'p_sk_20', name: 'Pandas', category: 'other' },
    { id: 'p_sk_21', name: 'Scikit-learn', category: 'other' },
    { id: 'p_sk_22', name: 'Seaborn', category: 'other' },
    { id: 'p_sk_23', name: 'Matplotlib', category: 'other' },
    { id: 'p_sk_24', name: 'Machine Learning Classification & Regression (Random Forest, Logistic Regression, Naive Bayes)', category: 'other' }
  ],
  publications: 'Conference Proceeding\n• Jha, P., Hamid, H., Olukola, O., Dahal, A., & Rahimi, N. (2026). Adversarial Machine Learning for Robust Password Strength Estimation. In: Rahimi, N., Margapuri, V., & Golilarz, N.A. (Eds.) Software and Data Engineering. SEDE 2025. Communications in Computer and Information Science, vol. 2720. Springer, Cham. https://doi.org/10.1007/978-3-032-08649-5_18\n\nPresentations\n• USM Undergraduate Symposium on Research & Creative Activity (UGS) – First Place (Computational Approaches category), Adversarial Machine Learning on Robust Password Strength Estimation (Apr 2025)',
  honorsAndAwards: '• USM President’s Lists: Fall 2023, Spring 2024, Fall 2024, Spring 2025, & Fall 2025 | Aug 2023 – Dec 2025\n• First Place, Undergraduate Symposium for Research and Creative Activity (UGS) | Apr 2025\n• International Ambassador of the Year, USM Center for International Education | Apr 2025\n• Innovation & Excellence Award, Roy Howard Community Journalism Center, USM | Apr 2025\n• Academic Excellence Scholarship, The University of Southern Mississippi | Aug 2023 - May 2027',
  showExperience: true,
  showInternships: true,
  showResearch: true,
  showLeadership: true
};
