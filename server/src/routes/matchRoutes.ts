import { Router } from 'express';
import {
  getRecommendedTeammates,
  sendTeamRequest,
  addToTeam,
  dismissRecommendation,
  restoreRecommendation,
  getMyRequests,
  respondToRequest
} from '../controllers/matchController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/recommendations', getRecommendedTeammates);
router.post('/request', sendTeamRequest);
router.post('/add-to-team', addToTeam);
router.post('/dismiss/:candidateId', dismissRecommendation);
router.post('/undismiss/:candidateId', restoreRecommendation);
router.get('/my-requests', getMyRequests);
router.patch('/request/:id/respond', respondToRequest);

export default router;
