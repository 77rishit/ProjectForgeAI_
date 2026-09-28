import { validate, ValidationRule } from '../middleware/validate.js';

// Auth validation rules
export const registerValidation = validate([
  { field: 'name', required: true, type: 'string', minLength: 2 },
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, type: 'string', minLength: 6 }
]);

export const loginValidation = validate([
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, type: 'string' }
]);

export const forgotPasswordValidation = validate([
  { field: 'email', required: true, type: 'email' }
]);

export const resetPasswordValidation = validate([
  { field: 'token', required: true, type: 'string' },
  { field: 'newPassword', required: false, type: 'string', minLength: 6 },
  { field: 'password', required: false, type: 'string', minLength: 6 }
]);

export const changePasswordValidation = validate([
  { field: 'currentPassword', required: true, type: 'string' },
  { field: 'newPassword', required: true, type: 'string', minLength: 6 }
]);


// Project validation rules
export const createProjectValidation = validate([
  { field: 'title', required: true, type: 'string', minLength: 3, maxLength: 120 },
  { field: 'description', required: true, type: 'string', minLength: 10 }
]);

// Task validation rules
export const createTaskValidation = validate([
  { field: 'title', required: true, type: 'string', minLength: 2 },
  {
    field: 'priority',
    required: false,
    enum: ['low', 'medium', 'high', 'urgent']
  },
  {
    field: 'status',
    required: false,
    enum: ['todo', 'in_progress', 'in_review', 'done']
  }
]);

// Milestone validation rules
export const createMilestoneValidation = validate([
  { field: 'title', required: true, type: 'string', minLength: 2 }
]);

export const reviewMilestoneValidation = validate([
  { field: 'feedback', required: false, type: 'string' },
  { field: 'approved', required: true, type: 'boolean' }
]);

// Project Idea validation rules
export const createIdeaValidation = validate([
  { field: 'title', required: true, type: 'string', minLength: 3 },
  { field: 'description', required: true, type: 'string', minLength: 10 }
]);

// Invitation validation rules
export const createInvitationValidation = validate([
  { field: 'project', required: true, type: 'string' },
  { field: 'receiver', required: true, type: 'string' }
]);

export const respondInvitationValidation = validate([
  { field: 'status', required: true, enum: ['accepted', 'rejected', 'canceled'] }
]);
