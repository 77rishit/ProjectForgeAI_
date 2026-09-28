import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { User, IUser, UserRole } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/activityService.js';


function generateToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      semester,
      profileImage,
      bio,
      skills,
      interests,
      availability,
      experience,
      github,
      linkedin,
      portfolio,
      preferredRole
    } = req.body;

    if (!name || !email || !password) {
      ApiResponse.error(res, 'Name, email, and password are required.', 400);
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      ApiResponse.error(res, 'An account with this email already exists.', 409);
      return;
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password, // will be hashed automatically by pre-save hook into passwordHash
      role: (role as UserRole) || 'student',
      department: department || 'Computer Science & Engineering',
      semester: semester || 'Semester 6',
      profileImage: profileImage || '',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      availability: availability !== undefined ? availability : 15,
      experience: experience || 'Intermediate',
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      preferredRole: preferredRole || 'Full-Stack Developer'
    });

    await user.save();
    const token = generateToken(user);

    await logActivity(user._id, 'USER_REGISTERED', undefined, { role: user.role, email: user.email });

    ApiResponse.created(
      res,
      { token, user },
      'User registered successfully'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error registering user', 500);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      ApiResponse.error(res, 'Email and password are required.', 400);
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      ApiResponse.error(res, 'Invalid email or password.', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      ApiResponse.error(res, 'Invalid email or password.', 401);
      return;
    }

    const token = generateToken(user);
    await logActivity(user._id, 'USER_LOGGED_IN', undefined, { email: user.email });

    ApiResponse.success(
      res,
      { token, user },
      'Login successful'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error logging in', 500);
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }
    ApiResponse.success(res, { user: req.user });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching user profile', 500);
  }
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    const role = (req.params.role as UserRole) || 'student';
    let user = await User.findOne({ role }).sort({ createdAt: 1 });

    if (!user) {
      const defaults: Record<UserRole, any> = {
        student: {
          name: 'Aarav Sharma',
          email: 'aarav@university.edu',
          password: 'password123',
          role: 'student',
          department: 'Computer Science & Engineering',
          semester: 'Semester 6',
          skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PyTorch'],
          skillDetails: [
            { name: 'TypeScript', proficiency: 'Expert', yearsOfExperience: 3 },
            { name: 'React', proficiency: 'Advanced', yearsOfExperience: 2 },
            { name: 'Node.js', proficiency: 'Advanced', yearsOfExperience: 2 },
            { name: 'Python', proficiency: 'Intermediate', yearsOfExperience: 2 },
            { name: 'PyTorch', proficiency: 'Intermediate', yearsOfExperience: 1 }
          ],
          interests: ['Autonomous Agents', 'Healthcare AI', 'System Design', 'Cloud Architecture'],
          preferredRole: 'Lead Full-Stack & ML',
          bio: 'CS junior passionate about scalable distributed systems and intelligent agent architectures.',
          github: 'https://github.com/aaravsharma',
          linkedin: 'https://linkedin.com/in/aaravsharma',
          portfolio: 'https://aaravsharma.dev',
          achievements: [
            {
              title: '1st Place - University AI Hackathon 2025',
              issuer: 'ACM Student Chapter',
              date: 'November 2025',
              description: 'Engineered an autonomous multi-agent clinical telemetry pipeline.',
              badge: 'Hackathon Winner'
            },
            {
              title: "Dean's Honor Roll",
              issuer: 'School of Engineering',
              date: 'Spring 2025',
              description: 'Recognized for top 5% academic performance across semester 4 & 5.',
              badge: 'Academic Honor'
            }
          ]
        },
        faculty: {
          name: 'Dr. Elena Vance',
          email: 'dr.elena@university.edu',
          password: 'password123',
          role: 'faculty',
          department: 'Computer Science & Engineering',
          semester: 'Faculty',
          skills: ['Distributed Systems', 'Applied AI', 'Formal Methods'],
          interests: ['Autonomous Systems', 'Research Mentorship'],
          bio: 'Associate Professor & Capstone Coordinator. Guiding multidisciplinary AI and systems projects.'
        },
        admin: {
          name: 'Prof. Marcus Reed',
          email: 'admin.marcus@university.edu',
          password: 'password123',
          role: 'admin',
          department: 'Academic Administration',
          semester: 'Staff',
          skills: ['Academic Operations', 'Curriculum Design', 'Resource Allocation'],
          interests: ['University Innovation', 'Industry Partnerships'],
          bio: 'Director of Academic Computing & ProjectForge AI Platform Administrator.'
        }
      };

      const data = defaults[role] || defaults.student;
      user = new User(data);
      await user.save();
    }

    const token = generateToken(user);
    ApiResponse.success(
      res,
      { token, user },
      `Demo login as ${role} successful`
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error executing demo login', 500);
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const allowedUpdates = [
      'name',
      'bio',
      'department',
      'semester',
      'profileImage',
      'avatar',
      'skills',
      'programmingLanguages',
      'preferences',
      'interests',
      'availability',
      'availabilityHours',
      'experience',
      'github',
      'githubUrl',
      'linkedin',
      'linkedinUrl',
      'portfolio',
      'portfolioUrl',
      'lookingForTeam',
      'preferredRole',
      'skillDetails',
      'achievements'
    ];

    const updates: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.skillDetails && Array.isArray(updates.skillDetails)) {
      updates.skills = updates.skillDetails.map((s: any) => s.name);
    }

    if (req.body.preferences && typeof req.body.preferences === 'object') {
      const existingPrefs = (req.user.preferences as any)?.toObject
        ? (req.user.preferences as any).toObject()
        : req.user.preferences || {};
      updates.preferences = {
        ...existingPrefs,
        ...req.body.preferences
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    ApiResponse.success(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating profile', 500);
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      ApiResponse.error(res, 'Email is required', 400);
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return success with generic message for privacy, but also let client know
      ApiResponse.success(
        res,
        { email },
        'If an account with that email exists, reset instructions have been dispatched.'
      );
      return;
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await logActivity(user._id, 'USER_REQUESTED_PASSWORD_RESET', undefined, { email: user.email });

    const clientUrl = ENV.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    ApiResponse.success(
      res,
      {
        resetToken,
        resetUrl,
        expiresIn: '1 hour'
      },
      'Password reset instructions generated successfully.'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error requesting password reset', 500);
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { token, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!token || !finalPassword) {
      ApiResponse.error(res, 'Reset token and new password are required.', 400);
      return;
    }

    if (String(finalPassword).length < 6) {
      ApiResponse.error(res, 'Password must be at least 6 characters long.', 400);
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      ApiResponse.error(res, 'Invalid or expired password reset token.', 400);
      return;
    }

    user.password = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = generateToken(user);
    await logActivity(user._id, 'USER_PASSWORD_RESET', undefined, { email: user.email });

    ApiResponse.success(
      res,
      { token: authToken, user },
      'Password has been reset successfully. You are now logged in.'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error resetting password', 500);
  }
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      ApiResponse.error(res, 'Current password and new password are required.', 400);
      return;
    }

    if (String(newPassword).length < 6) {
      ApiResponse.error(res, 'New password must be at least 6 characters long.', 400);
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      ApiResponse.error(res, 'User not found.', 404);
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      ApiResponse.error(res, 'Current password is incorrect.', 400);
      return;
    }

    user.password = newPassword;
    await user.save();

    await logActivity(user._id, 'USER_PASSWORD_CHANGED', undefined, { email: user.email });

    ApiResponse.success(res, null, 'Password updated successfully.');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error changing password', 500);
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (req.user) {
      await logActivity(req.user._id, 'USER_LOGGED_OUT', undefined, { email: req.user.email });
    }
    ApiResponse.success(res, null, 'Logged out successfully.');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error logging out', 500);
  }
}

export async function getUserProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    ApiResponse.success(res, { user });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching user profile', 500);
  }
}

