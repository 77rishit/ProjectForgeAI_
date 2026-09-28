import { Router } from 'express';
import {
  getMessagesByChannel,
  sendMessage,
  getConversations
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/:channelId', getMessagesByChannel);
router.post('/:channelId', sendMessage);

export default router;
