import { Router } from 'express';
import { getProjectActivities, getUserActivities } from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/project/:projectId', getProjectActivities);
router.get('/user', getUserActivities);

export default router;
