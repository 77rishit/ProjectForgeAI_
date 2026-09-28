import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Milestone } from '../models/Milestone.js';
import { ProjectIdea } from '../models/ProjectIdea.js';
import { TeamRequest } from '../models/TeamRequest.js';
import { TeamInvitation } from '../models/TeamInvitation.js';
import { Notification } from '../models/Notification.js';
import { Activity } from '../models/Activity.js';
import { SEED_USERS, SEED_IDEAS } from './seedData.js';

export async function runSeed(): Promise<void> {
  console.log('[Seed] Connecting to MongoDB...');
  await connectDB();

  console.log('[Seed] Resetting existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Milestone.deleteMany({}),
    ProjectIdea.deleteMany({}),
    TeamRequest.deleteMany({}),
    TeamInvitation.deleteMany({}),
    Notification.deleteMany({}),
    Activity.deleteMany({})
  ]);

  console.log('[Seed] Creating demo users...');
  const userDocs: Record<string, any> = {};
  for (const seedUser of SEED_USERS) {
    const user = new User(seedUser);
    await user.save();
    userDocs[seedUser.name] = user;
  }
  console.log(`[Seed] Created ${Object.keys(userDocs).length} users.`);

  const aarav = userDocs['Aarav Sharma'];
  const sarah = userDocs['Sarah Chen'];
  const rohan = userDocs['Rohan Patel'];
  const maya = userDocs['Maya Lin'];
  const liam = userDocs['Liam Scott'];
  const zoe = userDocs['Zoe Washington'];
  const drElena = userDocs['Dr. Elena Vance'];
  const drRajesh = userDocs['Dr. Rajesh Kumar'];

  console.log('[Seed] Creating realistic student projects...');

  // 1. ProjectForge AI (68% complete)
  const project1 = new Project({
    title: 'ProjectForge AI',
    description: 'AI-powered platform that helps students discover project ideas, find teammates and manage their projects.',
    abstract: 'A full-stack collaborative ecosystem with AI-assisted teammate compatibility scoring, idea discovery, and sprint task lifecycle management.',
    category: 'AI / Education',
    status: 'in-progress',
    progress: 68,
    lead: aarav._id,
    members: [
      { user: aarav._id, role: 'Lead Full-Stack Developer', joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { user: sarah._id, role: 'UI/UX Designer', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { user: rohan._id, role: 'Backend Engineer', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 4,
    facultyMentor: drElena._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Node.js', 'MongoDB', 'AI'],
    githubUrl: 'https://github.com/projectforge/platform',
    demoUrl: 'https://projectforge.ai',
    healthScore: 92
  });
  await project1.save();

  // Milestones for ProjectForge AI
  const m1_p1 = new Milestone({
    projectId: project1._id,
    title: 'Complete MVP Core Features',
    description: 'Build user authentication, profile portfolio, project creation, and team matching engine.',
    order: 1,
    targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days (Sep 30)
    status: 'in_progress',
    deliverables: [
      { title: 'Student & mentor JWT auth system', completed: true },
      { title: 'Project workspace and Kanban board', completed: true },
      { title: 'AI teammate recommendation algorithm', completed: false }
    ]
  });
  await m1_p1.save();

  const m2_p1 = new Milestone({
    projectId: project1._id,
    title: 'Student Beta Testing & Faculty Review',
    description: 'Deploy to campus pilot group of 50 students and collect usability feedback.',
    order: 2,
    targetDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'pending',
    deliverables: [
      { title: 'Pilot deployment on cloud server', completed: false },
      { title: 'Student feedback survey report', completed: false }
    ]
  });
  await m2_p1.save();

  // Tasks for ProjectForge AI
  const tasks_p1 = [
    {
      projectId: project1._id,
      title: 'Finish login system',
      description: 'Implement JWT session handling and role-based route guards.',
      status: 'done',
      priority: 'high',
      assignee: aarav._id,
      milestoneId: m1_p1._id,
      dueDate: new Date(),
      tags: ['Auth', 'Security'],
      createdBy: aarav._id
    },
    {
      projectId: project1._id,
      title: 'Create dashboard UI',
      description: 'Design and implement the student overview screen with clean metrics and next tasks.',
      status: 'in_progress',
      priority: 'high',
      assignee: sarah._id,
      milestoneId: m1_p1._id,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      tags: ['Frontend', 'UI'],
      createdBy: aarav._id
    },
    {
      projectId: project1._id,
      title: 'Connect AI recommendations',
      description: 'Wire up the recommendation engine to calculate teammate compatibility.',
      status: 'in_progress',
      priority: 'urgent',
      assignee: rohan._id,
      milestoneId: m1_p1._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Sep 28
      tags: ['AI', 'API'],
      createdBy: aarav._id
    },
    {
      projectId: project1._id,
      title: 'Design student teammate matching algorithm',
      description: 'Fine-tune skill complementarity weights so frontend and backend developers match together.',
      status: 'todo',
      priority: 'medium',
      assignee: aarav._id,
      milestoneId: m1_p1._id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      tags: ['Algorithm'],
      createdBy: aarav._id
    }
  ];
  await Task.insertMany(tasks_p1);

  // 2. Smart Campus Assistant (42% complete)
  const project2 = new Project({
    title: 'Smart Campus Assistant',
    description: 'An AI assistant that helps students find college information, events, departments and campus resources.',
    abstract: 'Combines full-text search with natural language answers for course schedules, faculty office hours, and library availability.',
    category: 'AI / Education',
    status: 'in-progress',
    progress: 42,
    lead: aarav._id,
    members: [
      { user: aarav._id, role: 'Full-Stack Developer', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { user: maya._id, role: 'AI Specialist', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 3,
    facultyMentor: drElena._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Node.js', 'AI'],
    githubUrl: 'https://github.com/projectforge/campus-assistant',
    healthScore: 88
  });
  await project2.save();

  const m1_p2 = new Milestone({
    projectId: project2._id,
    title: 'Campus Knowledge Base & Search API',
    description: 'Scrape and index official department FAQs and exam schedules.',
    order: 1,
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    deliverables: [
      { title: 'FAQ crawler module', completed: true },
      { title: 'Chat interface widget', completed: false }
    ]
  });
  await m1_p2.save();

  await Task.create([
    {
      projectId: project2._id,
      title: 'Build chat bubble UI component',
      description: 'Responsive drawer widget for quick queries on mobile.',
      status: 'in_progress',
      priority: 'high',
      assignee: aarav._id,
      milestoneId: m1_p2._id,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      tags: ['Frontend', 'UI'],
      createdBy: aarav._id
    },
    {
      projectId: project2._id,
      title: 'Index university academic calendar',
      description: 'Format semester exam dates and holidays into JSON.',
      status: 'done',
      priority: 'medium',
      assignee: maya._id,
      milestoneId: m1_p2._id,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['Data'],
      createdBy: aarav._id
    }
  ]);

  // 3. Hostel Complaint Management (75% complete)
  const project3 = new Project({
    title: 'Hostel Complaint Management',
    description: 'A web platform for students to submit, track and resolve hostel maintenance complaints.',
    abstract: 'Digital ticketing workflow replacing paper registers with instant status notifications for plumbing, Wi-Fi, and electrical issues.',
    category: 'Web Development',
    status: 'in-progress',
    progress: 75,
    lead: rohan._id,
    members: [
      { user: rohan._id, role: 'Lead Backend Developer', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { user: sarah._id, role: 'UI/UX Designer', joinedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 3,
    facultyMentor: drRajesh._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/projectforge/hostel-complaints',
    healthScore: 90
  });
  await project3.save();

  // 4. AI Resume Builder (35% complete)
  const project4 = new Project({
    title: 'AI Resume Builder',
    description: 'An AI-powered resume builder that helps students create ATS-friendly resumes.',
    abstract: 'Automates LaTeX/PDF resume generation with real-time keyword tailoring for job descriptions.',
    category: 'AI / Career',
    status: 'in-progress',
    progress: 35,
    lead: maya._id,
    members: [
      { user: maya._id, role: 'AI Engineer', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { user: aarav._id, role: 'Full-Stack Developer', joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 3,
    facultyMentor: drElena._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Node.js', 'AI'],
    githubUrl: 'https://github.com/projectforge/ai-resume-builder',
    healthScore: 84
  });
  await project4.save();

  // 5. Campus Event Hub (82% complete)
  const project5 = new Project({
    title: 'Campus Event Hub',
    description: 'A platform where students can discover, register for and manage college events.',
    abstract: 'Centralized discovery board for student clubs, tech hackathons, and cultural fests with QR ticket check-ins.',
    category: 'Web Development',
    status: 'in-progress',
    progress: 82,
    lead: liam._id,
    members: [
      { user: liam._id, role: 'Frontend Developer', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { user: aarav._id, role: 'Backend Contributor', joinedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 4,
    facultyMentor: drRajesh._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/projectforge/campus-events',
    healthScore: 95
  });
  await project5.save();

  // 6. Student Expense Tracker (55% complete)
  const project6 = new Project({
    title: 'Student Expense Tracker',
    description: 'A simple application for students to track expenses, budgets and monthly spending.',
    abstract: 'Lightweight budgeting PWA with category breakdowns, bill splitting with roommates, and allowance alerts.',
    category: 'Finance / Productivity',
    status: 'in-progress',
    progress: 55,
    lead: zoe._id,
    members: [
      { user: zoe._id, role: 'Full-Stack Developer', joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { user: rohan._id, role: 'Database Architect', joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) }
    ],
    maxMembers: 3,
    facultyMentor: drRajesh._id,
    mentorApprovalStatus: 'approved',
    tags: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/projectforge/expense-tracker',
    healthScore: 86
  });
  await project6.save();

  console.log('[Seed] Populating project ideas bank...');
  for (const idea of SEED_IDEAS) {
    const projectIdea = new ProjectIdea({
      ...idea,
      suggestedBy: drElena._id,
      bookmarkedBy: [aarav._id]
    });
    await projectIdea.save();
  }

  console.log('[Seed] Creating sample team requests & matching signals...');
  const req1 = new TeamInvitation({
    sender: rohan._id,
    receiver: sarah._id,
    project: project3._id,
    status: 'pending',
    message: 'Hi Sarah! We would love your UI/UX expertise to design the student complaint submission flow for Hostel Complaint Management.',
    compatibilityScore: 94,
    matchHighlights: [
      'UI/UX Design and Figma expertise',
      'Complements backend engineering skills',
      'High mutual availability (18 hrs/week)'
    ]
  });
  await req1.save();

  const req2 = new TeamInvitation({
    sender: maya._id,
    receiver: aarav._id,
    project: project4._id,
    status: 'pending',
    message: 'Hello Aarav! I am working on the AI Resume Builder and would love to collaborate on the React frontend.',
    compatibilityScore: 92,
    matchHighlights: [
      'Strong React and TypeScript skills',
      'Shared interest in AI and career tools',
      'Available 20 hrs/week'
    ]
  });
  await req2.save();

  console.log('[Seed] Creating sample Activity records...');
  await Activity.create([
    {
      user: aarav._id,
      project: project1._id,
      action: 'Completed login authentication system',
      details: 'JWT session guards and student login flow',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
    },
    {
      user: sarah._id,
      project: project1._id,
      action: 'Updated dashboard wireframes in Figma',
      details: 'Simplified metrics and responsive cards',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5h ago
    },
    {
      user: rohan._id,
      project: project3._id,
      action: 'Deployed MongoDB complaint status pipeline',
      details: 'Added automated status transitions',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    },
    {
      user: drElena._id,
      project: project1._id,
      action: 'Approved project proposal for ProjectForge AI',
      details: 'Capstone proposal endorsed for Semester 6',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2d ago
    }
  ]);

  console.log('[Seed] Database successfully seeded with realistic student projects and activities!');
}

if (process.argv[1] && process.argv[1].includes('seedRunner')) {
  runSeed()
    .then(() => {
      console.log('[Seed] Completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    });
}
