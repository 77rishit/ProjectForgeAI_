import { Router } from 'express';
import {
  getIdeas,
  getRecommendedIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  generateIdeas,
  bookmarkIdea,
  adoptIdea
} from '../controllers/ideaController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getIdeas);
router.get('/recommendations', getRecommendedIdeas);
router.post('/', createIdea);
router.get('/:id', getIdeaById);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);
router.post('/generate', generateIdeas);
router.post('/:id/bookmark', bookmarkIdea);
router.post('/:id/adopt', adoptIdea);

export default router;

