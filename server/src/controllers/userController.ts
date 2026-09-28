import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';

export async function getStudents(req: Request, res: Response): Promise<void> {
  try {
    const { department, skill, lookingForTeam, search } = req.query;
    const filter: Record<string, any> = { role: 'student', status: 'active' };

    if (department) {
      filter.department = department;
    }

    if (lookingForTeam !== undefined) {
      filter.lookingForTeam = lookingForTeam === 'true';
    }

    if (skill) {
      filter.skills = { $regex: new RegExp(skill as string, 'i') };
    }

    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [
        { name: regex },
        { skills: regex },
        { interests: regex },
        { preferredRole: regex },
        { department: regex }
      ];
    }

    const students = await User.find(filter)
      .sort({ updatedAt: -1 })
      .limit(50);

    ApiResponse.success(res, { students });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching students', 500);
  }
}

export async function getFacultyMentors(_req: Request, res: Response): Promise<void> {
  try {
    const faculty = await User.find({ role: 'faculty', status: 'active' })
      .sort({ name: 1 });

    const facultyWithStats = await Promise.all(
      faculty.map(async (f) => {
        const mentoredCount = await Project.countDocuments({ facultyMentor: f._id });
        return {
          ...f.toObject(),
          mentoredCount
        };
      })
    );

    ApiResponse.success(res, { faculty: facultyWithStats });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching faculty mentors', 500);
  }
}

export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { role, department, search, page = '1', limit = '50' } = req.query;
    const filter: Record<string, any> = {};

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { department: regex }];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    ApiResponse.success(res, { users }, 'Users retrieved', 200, {
      page: pageNum,
      limit: limitNum,
      total
    });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching users list', 500);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role, status, department } = req.body;

    const user = await User.findById(id);
    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    if (role) user.role = role;
    if (status) user.status = status;
    if (department) user.department = department;
    await user.save();

    ApiResponse.success(res, { user }, 'User updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating user role', 500);
  }
}
