import { Router } from 'express';
import {
  getMilestonesByProject,
  createMilestone,
  updateMilestone,
  submitMilestone,
  reviewMilestone,
  getRubricSuggestion
} from '../controllers/milestoneController.js';
import { authenticate } from '../middleware/auth.js';
import { createMilestoneValidation, reviewMilestoneValidation } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/project/:projectId', getMilestonesByProject);
router.post('/', createMilestoneValidation, createMilestone);
router.put('/:id', updateMilestone);
router.post('/:id/submit', submitMilestone);
router.post('/:id/review', reviewMilestoneValidation, reviewMilestone);
router.get('/:id/rubric-suggestion', getRubricSuggestion);

export default router;

