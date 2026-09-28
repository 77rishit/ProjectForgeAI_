import { UserRole } from '../models/User.js';

export interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  year: string;
  skills: string[];
  interests: string[];
  availabilityHours: number;
  lookingForTeam: boolean;
  preferredRole: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: 'Semester 6',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AI'],
    interests: ['AI in Education', 'Web Development', 'Student Productivity'],
    availabilityHours: 20,
    lookingForTeam: true,
    preferredRole: 'Full-Stack Developer',
    bio: 'CS student passionate about building AI tools and collaborative web applications for students.',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Design & Human-Computer Interaction',
    year: 'Semester 6',
    skills: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'React', 'User Research'],
    interests: ['Accessible Interfaces', 'Product Design', 'Design Systems'],
    availabilityHours: 18,
    lookingForTeam: true,
    preferredRole: 'UI/UX Designer',
    bio: 'Design student focused on creating clean, student-friendly SaaS experiences and intuitive design systems.',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    name: 'Rohan Patel',
    email: 'rohan.patel@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: 'Semester 6',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker'],
    interests: ['Backend Development', 'API Design', 'Database Architecture'],
    availabilityHours: 15,
    lookingForTeam: true,
    preferredRole: 'Backend Developer',
    bio: 'Backend developer who loves building fast REST APIs, database schemas, and microservices.',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    name: 'Maya Lin',
    email: 'maya.lin@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Data Science & Artificial Intelligence',
    year: 'Semester 4',
    skills: ['Python', 'AI', 'NLP', 'TensorFlow', 'Pandas'],
    interests: ['Natural Language Processing', 'Chatbots', 'Career Tech'],
    availabilityHours: 16,
    lookingForTeam: true,
    preferredRole: 'AI & Data Specialist',
    bio: 'Data Science sophomore interested in NLP applications, resume parsing, and conversational AI.',
    githubUrl: 'https://github.com'
  },
  {
    name: 'Liam Scott',
    email: 'liam.scott@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Information Technology',
    year: 'Semester 6',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'SQL'],
    interests: ['Campus Tech', 'Community Platforms', 'Event Management'],
    availabilityHours: 20,
    lookingForTeam: true,
    preferredRole: 'Frontend Developer',
    bio: 'IT student building community platforms to connect college students and campus clubs.',
    githubUrl: 'https://github.com'
  },
  {
    name: 'Zoe Washington',
    email: 'zoe.w@university.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: 'Semester 4',
    skills: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    interests: ['Personal Finance', 'Student Productivity', 'Full-Stack Apps'],
    availabilityHours: 14,
    lookingForTeam: true,
    preferredRole: 'Full-Stack Developer',
    bio: 'CS student building practical web apps for budgeting and campus life productivity.',
    githubUrl: 'https://github.com'
  },
  {
    name: 'Dr. Elena Vance',
    email: 'dr.elena@university.edu',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    year: 'Faculty',
    skills: ['Web Architecture', 'Applied AI', 'Database Systems', 'Project Mentorship'],
    interests: ['Student Capstones', 'Educational Technology', 'Mentorship'],
    availabilityHours: 10,
    lookingForTeam: false,
    preferredRole: 'Faculty Mentor',
    bio: 'Associate Professor & Capstone Coordinator. Mentoring student engineering projects.'
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'dr.rajesh@university.edu',
    password: 'password123',
    role: 'faculty',
    department: 'Information Technology',
    year: 'Faculty',
    skills: ['Software Engineering', 'Cloud Platforms', 'Web Systems'],
    interests: ['Student Startups', 'Campus Automation'],
    availabilityHours: 8,
    lookingForTeam: false,
    preferredRole: 'Faculty Mentor',
    bio: 'Professor of Information Technology guiding student web and mobile development teams.'
  },
  {
    name: 'Prof. Marcus Reed',
    email: 'admin.marcus@university.edu',
    password: 'password123',
    role: 'admin',
    department: 'Academic Administration',
    year: 'Staff',
    skills: ['Academic Administration', 'Program Coordination'],
    interests: ['Student Success', 'Project-Based Learning'],
    availabilityHours: 40,
    lookingForTeam: false,
    preferredRole: 'Platform Administrator',
    bio: 'Director of Academic Computing & ProjectForge AI Platform Administrator.'
  }
];

export const SEED_IDEAS = [
  {
    title: 'ProjectForge AI',
    domain: 'AI / Education',
    difficulty: 'Advanced',
    problemStatement: 'Students often struggle to find relevant project ideas, complementary teammates, and structured tracking tools for their capstones.',
    solutionOverview: 'An AI-powered project lifecycle platform that helps students discover project ideas, find teammates, and manage their projects.',
    recommendedStack: ['React', 'Node.js', 'MongoDB', 'AI'],
    rolesNeeded: ['Lead Developer', 'UI/UX Designer', 'Backend Engineer'],
    estimatedDuration: '12-16 weeks',
    tags: ['React', 'Node.js', 'MongoDB', 'AI']
  },
  {
    title: 'Smart Campus Assistant',
    domain: 'AI / Education',
    difficulty: 'Intermediate',
    problemStatement: 'Navigating college schedules, exam routines, club notifications, and departmental resources across fragmented portals is overwhelming.',
    solutionOverview: 'An AI assistant that helps students find college information, events, departments, and campus resources with conversational search.',
    recommendedStack: ['React', 'Node.js', 'AI', 'MongoDB'],
    rolesNeeded: ['AI Engineer', 'Frontend Developer', 'API Developer'],
    estimatedDuration: '8-10 weeks',
    tags: ['React', 'Node.js', 'AI', 'Education']
  },
  {
    title: 'Hostel Complaint Management',
    domain: 'Web Development',
    difficulty: 'Intermediate',
    problemStatement: 'Hostel maintenance requests (plumbing, electrical, Wi-Fi) get lost in paper registers with zero status visibility.',
    solutionOverview: 'A web platform for students to submit, track, and resolve hostel maintenance complaints with real-time status updates.',
    recommendedStack: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
    rolesNeeded: ['Full-Stack Developer', 'UI Designer'],
    estimatedDuration: '6-8 weeks',
    tags: ['React', 'Express', 'MongoDB', 'Web Development']
  },
  {
    title: 'AI Resume Builder',
    domain: 'AI / Career',
    difficulty: 'Intermediate',
    problemStatement: 'College students struggle to format resumes according to industry standards and pass Automated Tracking Systems (ATS).',
    solutionOverview: 'An AI-powered resume builder that helps students create ATS-friendly resumes with tailored action-verb suggestions.',
    recommendedStack: ['React', 'Node.js', 'AI', 'Tailwind CSS'],
    rolesNeeded: ['Frontend Engineer', 'NLP / AI Developer'],
    estimatedDuration: '6-8 weeks',
    tags: ['React', 'Node.js', 'AI', 'Career']
  },
  {
    title: 'Campus Event Hub',
    domain: 'Web Development',
    difficulty: 'Beginner',
    problemStatement: 'College clubs struggle to publicize technical workshops, cultural fests, and hackathons effectively across campus.',
    solutionOverview: 'A centralized platform where students can discover, register for, and manage college events with calendar integration.',
    recommendedStack: ['React', 'Node.js', 'MongoDB'],
    rolesNeeded: ['Frontend Developer', 'Backend Developer'],
    estimatedDuration: '4-6 weeks',
    tags: ['React', 'Node.js', 'MongoDB', 'Events']
  },
  {
    title: 'Student Expense Tracker',
    domain: 'Finance / Productivity',
    difficulty: 'Beginner',
    problemStatement: 'College students on monthly allowances frequently run out of funds without understanding their spending breakdown.',
    solutionOverview: 'A simple application for students to track expenses, set budgets, and visualize monthly spending categories.',
    recommendedStack: ['React', 'Node.js', 'MongoDB'],
    rolesNeeded: ['Full-Stack Developer'],
    estimatedDuration: '4-6 weeks',
    tags: ['React', 'Node.js', 'MongoDB', 'Finance']
  },
  {
    title: 'Peer Tutoring Network',
    domain: 'AI / Education',
    difficulty: 'Beginner',
    problemStatement: 'Juniors seeking coursework help struggle to find seniors who excelled in those specific subjects.',
    solutionOverview: 'A peer-to-peer tutoring board matching student mentors with learners for exam prep and lab guidance.',
    recommendedStack: ['React', 'Node.js', 'MongoDB'],
    rolesNeeded: ['Full-Stack Developer', 'UI/UX Designer'],
    estimatedDuration: '6-8 weeks',
    tags: ['React', 'Node.js', 'Education']
  },
  {
    title: 'Campus Lost and Found Portal',
    domain: 'Web Development',
    difficulty: 'Beginner',
    problemStatement: 'Lost student IDs, water bottles, and electronics clutter security desks with no easy way to claim them.',
    solutionOverview: 'A student portal with photo uploads and verification questions to quickly return lost items on campus.',
    recommendedStack: ['React', 'Express', 'MongoDB'],
    rolesNeeded: ['Frontend Developer'],
    estimatedDuration: '4-6 weeks',
    tags: ['React', 'Express', 'Campus']
  }
];
