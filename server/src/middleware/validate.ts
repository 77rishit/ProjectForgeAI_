import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email';
  enum?: string[];
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (val: any) => boolean | string;
}

export function validate(rules: ValidationRule[], source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source] || {};
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const val = data[rule.field];

      // Check required
      if (rule.required && (val === undefined || val === null || val === '')) {
        errors[rule.field] = `${rule.field} is required.`;
        continue;
      }

      if (val === undefined || val === null || val === '') {
        continue;
      }

      // Type checks
      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val))) {
          errors[rule.field] = `${rule.field} must be a valid email address.`;
        }
      } else if (rule.type === 'array') {
        if (!Array.isArray(val)) {
          errors[rule.field] = `${rule.field} must be an array.`;
        }
      } else if (rule.type && typeof val !== rule.type) {
        errors[rule.field] = `${rule.field} must be of type ${rule.type}.`;
      }

      // Enum check
      if (rule.enum && !rule.enum.includes(val)) {
        errors[rule.field] = `${rule.field} must be one of [${rule.enum.join(', ')}].`;
      }

      // String length checks
      if (rule.minLength && String(val).length < rule.minLength) {
        errors[rule.field] = `${rule.field} must be at least ${rule.minLength} characters.`;
      }
      if (rule.maxLength && String(val).length > rule.maxLength) {
        errors[rule.field] = `${rule.field} cannot exceed ${rule.maxLength} characters.`;
      }

      // Numeric range checks
      if (rule.min !== undefined && Number(val) < rule.min) {
        errors[rule.field] = `${rule.field} must be at least ${rule.min}.`;
      }
      if (rule.max !== undefined && Number(val) > rule.max) {
        errors[rule.field] = `${rule.field} cannot exceed ${rule.max}.`;
      }

      // Custom check
      if (rule.custom) {
        const customRes = rule.custom(val);
        if (typeof customRes === 'string') {
          errors[rule.field] = customRes;
        } else if (!customRes) {
          errors[rule.field] = `${rule.field} failed validation.`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      ApiResponse.error(res, 'Validation failed', 400, errors);
      return;
    }

    next();
  };
}
