import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProjectIdea extends Document {
  title: string;
  description: string;
  category: string;
  domain?: string; // alias
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredSkills: string[];
  technologies: string[];
  recommendedStack?: string[]; // alias
  rolesNeeded?: string[]; // alias
  estimatedDuration: string;
  department: string;
  generatedByAI: boolean;
  problemStatement?: string;
  solutionOverview?: string;
  facultyApproved: boolean;
  suggestedBy?: Types.ObjectId;
  bookmarkedBy: Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectIdeaSchema = new Schema<IProjectIdea>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      default: 'AI / Machine Learning',
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
      index: true
    },
    requiredSkills: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    estimatedDuration: { type: String, default: '1 Semester (12-16 weeks)' },
    department: {
      type: String,
      required: true,
      default: 'Computer Science & Engineering',
      index: true
    },
    generatedByAI: { type: Boolean, default: false, index: true },
    facultyApproved: { type: Boolean, default: true },
    suggestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases
ProjectIdeaSchema.virtual('domain').get(function () {
  return this.category;
}).set(function (val: string) {
  this.category = val;
});

ProjectIdeaSchema.virtual('problemStatement').get(function () {
  return this.description;
}).set(function (val: string) {
  this.description = val;
});

ProjectIdeaSchema.virtual('solutionOverview').get(function () {
  return this.description;
}).set(function (val: string) {
  this.description = val;
});

ProjectIdeaSchema.virtual('recommendedStack').get(function () {
  return this.technologies;
}).set(function (val: string[]) {
  this.technologies = val;
});

ProjectIdeaSchema.virtual('rolesNeeded').get(function () {
  return this.requiredSkills;
}).set(function (val: string[]) {
  this.requiredSkills = val;
});

export const ProjectIdea = mongoose.model<IProjectIdea>('ProjectIdea', ProjectIdeaSchema);
