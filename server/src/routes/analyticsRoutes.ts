import { Router } from 'express';
import {
  getStudentAnalytics,
  getFacultyAnalytics,
  getAdminAnalytics
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.use(authenticate);

router.get('/student', getStudentAnalytics);
router.get('/faculty', authorize('faculty', 'admin'), getFacultyAnalytics);
router.get('/admin', authorize('admin'), getAdminAnalytics);

export default router;
