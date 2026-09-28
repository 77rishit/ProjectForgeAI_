import { Router } from 'express';
import { getStudents, getFacultyMentors, getAllUsers, updateUserRole } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.get('/students', authenticate, getStudents);
router.get('/faculty', authenticate, getFacultyMentors);
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.patch('/:id/role', authenticate, authorize('admin'), updateUserRole);

export default router;
