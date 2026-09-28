import { Router } from 'express';
import { getTasksByProject, getMyTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { createTaskValidation } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/my-tasks', getMyTasks);
router.get('/project/:projectId', getTasksByProject);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTask);
router.patch('/:id', updateTask);
router.patch('/:id/status', updateTask);
router.delete('/:id', deleteTask);

export default router;

