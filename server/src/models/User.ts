import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface IUserSkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

export interface IUserAchievement {
  title: string;
  description?: string;
  date?: string;
  issuer?: string;
  badge?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  password?: string;
  role: UserRole;
  department: string;
  semester?: number | string;
  profileImage?: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  skillDetails: IUserSkill[];
  achievements: IUserAchievement[];
  programmingLanguages?: string[];
  preferences?: {
    theme?: 'dark' | 'light' | 'system';
    emailDigest?: boolean;
    sprintAlerts?: boolean;
    teammateInvites?: boolean;
    profileVisible?: boolean;
    aiSuggestions?: boolean;
  };
  interests: string[];
  availability: number | string;
  availabilityHours?: number;
  experience?: string;
  github?: string;
  githubUrl?: string;
  linkedin?: string;
  linkedinUrl?: string;
  portfolio?: string;
  portfolioUrl?: string;
  status: 'active' | 'inactive';
  lookingForTeam: boolean;
  preferredRole?: string;
  dismissedRecommendations?: (Schema.Types.ObjectId | string)[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student', index: true },
    department: { type: String, required: true, default: 'Computer Science & Engineering' },
    semester: { type: Schema.Types.Mixed, default: 'Semester 6' },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    skillDetails: [
      {
        name: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Intermediate'
        },
        yearsOfExperience: { type: Number, default: 1 }
      }
    ],
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        date: { type: String, default: '' },
        issuer: { type: String, default: '' },
        badge: { type: String, default: '' }
      }
    ],
    programmingLanguages: {
      type: [String],
      default: ['TypeScript', 'Python', 'Go', 'JavaScript', 'SQL']
    },
    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      emailDigest: { type: Boolean, default: true },
      sprintAlerts: { type: Boolean, default: true },
      teammateInvites: { type: Boolean, default: true },
      profileVisible: { type: Boolean, default: true },
      aiSuggestions: { type: Boolean, default: true }
    },
    interests: { type: [String], default: [] },
    availability: { type: Schema.Types.Mixed, default: 15 }, // hours per week
    experience: { type: String, default: 'Intermediate' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lookingForTeam: { type: Boolean, default: true, index: true },
    preferredRole: { type: String, default: 'Full-Stack Developer' },
    dismissedRecommendations: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.passwordHash;
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);


// Virtual aliases for compatibility
UserSchema.virtual('avatar').get(function () {
  return this.profileImage;
}).set(function (val: string) {
  this.profileImage = val;
});

UserSchema.virtual('githubUrl').get(function () {
  return this.github;
}).set(function (val: string) {
  this.github = val;
});

UserSchema.virtual('linkedinUrl').get(function () {
  return this.linkedin;
}).set(function (val: string) {
  this.linkedin = val;
});

UserSchema.virtual('portfolioUrl').get(function () {
  return this.portfolio;
}).set(function (val: string) {
  this.portfolio = val;
});

UserSchema.virtual('availabilityHours').get(function () {
  return typeof this.availability === 'number' ? this.availability : parseInt(String(this.availability), 10) || 15;
}).set(function (val: number) {
  this.availability = val;
});

UserSchema.virtual('year').get(function () {
  return String(this.semester || 'Year 3');
});

// Virtual password setter that automatically hashes into passwordHash
UserSchema.virtual('password')
  .set(function (password: string) {
    (this as any)._rawPassword = password;
  })
  .get(function () {
    return (this as any)._rawPassword;
  });

UserSchema.pre('validate', async function () {
  // Sync skillDetails and skills
  if (this.skillDetails && this.skillDetails.length > 0) {
    this.skills = this.skillDetails.map((s) => s.name);
  } else if (this.skills && this.skills.length > 0 && (!this.skillDetails || this.skillDetails.length === 0)) {
    this.skillDetails = this.skills.map((s) => ({
      name: s,
      proficiency: 'Intermediate',
      yearsOfExperience: 1
    }));
  }

  const rawPassword = (this as any)._rawPassword;
  if (rawPassword) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(rawPassword, salt);
    (this as any)._rawPassword = undefined;
  } else if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
});


UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
