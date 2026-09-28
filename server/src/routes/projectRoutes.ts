import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getFacultySupervisedProjects,
  getProjectById,
  createProject,
  updateProject,
  respondToMentorRequest,
  addMember,
  removeMember,
  deleteProject,
  triggerHealthAssessment
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { createProjectValidation } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.get('/my', getMyProjects);
router.get('/supervised', getFacultySupervisedProjects);
router.get('/:id', getProjectById);
router.post('/', createProjectValidation, createProject);

router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/mentor-response', respondToMentorRequest);
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);
router.post('/:id/assess-health', triggerHealthAssessment);

export default router;
