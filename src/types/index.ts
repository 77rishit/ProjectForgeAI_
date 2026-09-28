export type UserRole = 'student' | 'faculty' | 'admin';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserSkill {
  name: string;
  proficiency: SkillProficiency;
  yearsOfExperience: number;
}

export interface Achievement {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  date?: string;
  issuer?: string;
  badge?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  semester?: string | number;
  year?: string;
  profileImage?: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  skillDetails?: UserSkill[];
  achievements?: Achievement[];
  interests: string[];
  availability?: number | string;
  availabilityHours: number;
  experience?: string;
  github?: string;
  githubUrl?: string;
  linkedin?: string;
  linkedinUrl?: string;
  portfolio?: string;
  portfolioUrl?: string;
  programmingLanguages?: string[];
  preferences?: {
    theme?: 'dark' | 'light' | 'system';
    emailDigest?: boolean;
    sprintAlerts?: boolean;
    teammateInvites?: boolean;
    profileVisible?: boolean;
    aiSuggestions?: boolean;
  };
  lookingForTeam: boolean;
  preferredRole?: string;
  mentoredCount?: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CalendarEventType = 'meeting' | 'deadline' | 'milestone' | 'faculty' | 'team' | 'defense' | 'checkpoint' | 'other';

export interface CalendarEvent {
  _id: string;
  id?: string;
  user: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  type: CalendarEventType;
  project?: string;
  completed?: boolean;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole?: string;
  avatar?: string;
  content: string;
  time: string;
  isMe?: boolean;
}

export type ProjectStatus = 'ideation' | 'planning' | 'in-progress' | 'review' | 'completed' | 'draft' | 'archived';
export type MentorApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface ProjectMember {
  user: User;
  role: string;
  joinedAt: string;
}

export interface ArchitectureBlueprint {
  title: string;
  summary: string;
  pattern: string;
  model: string;
  vectorDb: string;
  systemPrompt: string;
  databaseSchema: string;
  agentTopology: {
    name: string;
    role: string;
    tools: string[];
  }[];
  roadmap: {
    phase: string;
    description: string;
  }[];
  metrics: {
    estimatedTokens: string;
    avgLatency: string;
    complexityScore: string;
    costEstimate: string;
  };
}

export interface ProjectHealthAssessment {
  status: 'healthy' | 'at-risk' | 'critical';
  summary: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  abstract: string;
  category: string;
  status: ProjectStatus;
  lead: User;
  owner?: User | any;
  members: ProjectMember[];
  maxMembers: number;
  facultyMentor?: User;
  mentorApprovalStatus: MentorApprovalStatus;
  mentorNotes?: string;
  tags: string[];
  technologies?: string[];
  deadline?: string | Date;
  repositoryUrl?: string;
  deploymentUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  architectureBlueprint?: ArchitectureBlueprint;
  healthScore: number;
  progress?: number;
  healthAssessment?: ProjectHealthAssessment;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  milestoneId?: { _id: string; title: string; order: number };
  dueDate?: string;
  tags: string[];
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision_requested';

export interface Deliverable {
  title: string;
  completed: boolean;
}

export interface RubricScores {
  innovation: number;
  technicalExecution: number;
  documentation: number;
  teamwork: number;
  presentation: number;
}

export interface MilestoneReview {
  faculty: User;
  reviewedAt: string;
  feedback: string;
  rubricScores: RubricScores;
  overallScore: number;
  approved: boolean;
}

export interface Milestone {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  targetDate: string;
  status: MilestoneStatus;
  deliverables: Deliverable[];
  submissionNotes?: string;
  submissionUrl?: string;
  submittedAt?: string;
  review?: MilestoneReview;
  createdAt: string;
}

export interface ProjectIdea {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  domain: string;
  department?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problemStatement?: string;
  solutionOverview?: string;
  objectives?: string[];
  recommendedStack?: string[];
  technologies?: string[];
  rolesNeeded?: string[];
  requiredSkills?: string[];
  estimatedDuration: string;
  facultyApproved?: boolean;
  suggestedBy?: User;
  bookmarkedBy: string[];
  tags: string[];
  createdAt: string;
  matchPercentage?: number;
  matchReasons?: string[];
  skillMatches?: string[];
  interestMatches?: string[];
  isBookmarked?: boolean;
}

export interface ProjectIdeaMatchData {
  ideaId: string;
  matchPercentage: number;
  matchReasons: string[];
  skillMatches: string[];
  interestMatches: string[];
}

export interface TeammateMatch {
  userId: string;
  user: User;
  compatibilityScore: number;
  matchPercentage?: number;
  matchHighlights: string[];
  whyMatches?: string[];
  complementarySkills: string[];
  overlapSkills: string[];
  recommendedRole: string;
  isDismissed?: boolean;
}

export interface TeamRequest {
  _id: string;
  fromUser: User;
  toUser: User;
  projectId: { _id: string; title: string; category: string; status: ProjectStatus };
  type: 'join_request' | 'invite';
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  compatibilityScore: number;
  matchHighlights: string[];
  createdAt: string;
}

export interface StudentAnalytics {
  activeProjectsCount: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  taskCompletionRate: number;
  approvedMilestones: number;
  totalMilestones: number;
  topSkills: { name: string; count: number }[];
  healthAverage: number;
}

export interface FacultyAnalytics {
  supervisedProjectsCount: number;
  pendingReviewsCount: number;
  approvedMilestonesCount: number;
  averageRubricScore: number;
  atRiskProjectsCount: number;
  pendingMilestones: Milestone[];
  atRiskProjects: { id: string; title: string; healthScore: number; status: string }[];
}

export interface AdminAnalytics {
  totalStudents: number;
  totalFaculty: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  categoryDistribution: { category: string; count: number }[];
  topTechStacks: { tech: string; count: number }[];
}

export interface ActivityItem {
  _id: string;
  user?: User | { _id: string; name: string; avatar?: string };
  project?: { _id: string; title: string; category?: string; status?: string };
  action: string;
  details?: string;
  timestamp?: string;
  createdAt?: string;
}

