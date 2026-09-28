import mongoose, { Schema, Document, Types } from 'mongoose';

export type ProjectStatus = 'ideation' | 'planning' | 'in-progress' | 'review' | 'completed';
export type MentorApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface IProjectMember {
  user: Types.ObjectId;
  role: string;
  joinedAt: Date;
}

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  department: string;
  requiredSkills: string[];
  owner: Types.ObjectId;
  lead?: Types.ObjectId; // alias
  members: IProjectMember[];
  facultyMentor?: Types.ObjectId;
  mentorApprovalStatus: MentorApprovalStatus;
  status: ProjectStatus;
  progress: number;
  startDate: Date;
  deadline: Date;
  technologies: string[];
  objectives: string[];
  repositoryUrl: string;
  deploymentUrl: string;
  abstract?: string;
  tags?: string[];
  maxMembers: number;
  architectureBlueprint?: Record<string, any>;
  healthScore: number;
  healthAssessment?: {
    status: 'healthy' | 'at-risk' | 'critical';
    summary: string;
    recommendations: string[];
    analyzedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      default: 'AI / Machine Learning',
      index: true
    },
    department: {
      type: String,
      required: true,
      default: 'Computer Science & Engineering',
      index: true
    },
    requiredSkills: { type: [String], default: [] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, default: 'Member' },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    facultyMentor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    mentorApprovalStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    status: {
      type: String,
      enum: ['ideation', 'planning', 'in-progress', 'review', 'completed'],
      default: 'planning',
      index: true
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
    technologies: { type: [String], default: [], index: true },
    objectives: { type: [String], default: [] },
    repositoryUrl: { type: String, default: '' },
    deploymentUrl: { type: String, default: '' },
    abstract: { type: String, default: '' },
    maxMembers: { type: Number, default: 4 },
    architectureBlueprint: { type: Schema.Types.Mixed, default: null },
    healthScore: { type: Number, default: 85, min: 0, max: 100 },
    healthAssessment: {
      status: { type: String, enum: ['healthy', 'at-risk', 'critical'], default: 'healthy' },
      summary: { type: String, default: 'Project initialized.' },
      recommendations: { type: [String], default: [] },
      analyzedAt: { type: Date, default: Date.now }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases
ProjectSchema.virtual('lead').get(function () {
  return this.owner;
}).set(function (val: Types.ObjectId) {
  this.owner = val;
});

ProjectSchema.virtual('tags').get(function () {
  return this.technologies;
}).set(function (val: string[]) {
  this.technologies = val;
});

ProjectSchema.virtual('githubUrl').get(function () {
  return this.repositoryUrl;
}).set(function (val: string) {
  this.repositoryUrl = val;
});

ProjectSchema.virtual('demoUrl').get(function () {
  return this.deploymentUrl;
}).set(function (val: string) {
  this.deploymentUrl = val;
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
