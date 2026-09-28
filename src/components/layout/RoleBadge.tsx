import React from 'react';
import { UserRole } from '../../types';
import { Badge } from '../ui/Badge';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

export interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  switch (role) {
    case 'faculty':
      return (
        <Badge variant="purple" size={size} className="gap-1.5 font-medium">
          <BookOpen className="w-3 h-3 text-purple-400" />
          <span>Faculty Mentor</span>
        </Badge>
      );
    case 'admin':
      return (
        <Badge variant="danger" size={size} className="gap-1.5 font-medium">
          <ShieldCheck className="w-3 h-3 text-rose-400" />
          <span>Administrator</span>
        </Badge>
      );
    case 'student':
    default:
      return (
        <Badge variant="indigo" size={size} className="gap-1.5 font-medium">
          <GraduationCap className="w-3 h-3 text-indigo-400" />
          <span>Student</span>
        </Badge>
      );
  }
};
