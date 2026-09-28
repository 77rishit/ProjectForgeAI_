import { Router } from 'express';
import {
  createInvitation,
  getMyInvitations,
  respondToInvitation
} from '../controllers/invitationController.js';
import { authenticate } from '../middleware/auth.js';
import { createInvitationValidation, respondInvitationValidation } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.post('/', createInvitationValidation, createInvitation);
router.get('/my', getMyInvitations);
router.patch('/:id/respond', respondInvitationValidation, respondToInvitation);

export default router;
