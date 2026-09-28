import { Router } from 'express';
import {
  chatWithAssistant,
  getProjectChatHistory,
  generateProjectIdeas,
  analyzeTeamMatch,
  breakDownProject,
  assessProjectHealth,
  synthesizeArchitecture,
  generateIdeasLegacy
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/aiRateLimiter.js';

const router = Router();

// Authentication required for all AI endpoints
router.use(authenticate);

// Per-user rate limiting required for all AI endpoints
router.use(aiRateLimiter);

// 1. AI Assistant Chat & History
router.post('/chat', chatWithAssistant);
router.get('/chat/:projectId', getProjectChatHistory);

// 2. AI Project Idea Generator
router.post('/project-ideas', generateProjectIdeas);

// 3. AI Team Matching
router.post('/team-match', analyzeTeamMatch);

// 4. AI Project Breakdown (Milestones & Tasks)
router.post('/project-breakdown', breakDownProject);

// 5. AI Project Health Audit
router.post('/project-health', assessProjectHealth);

// 6. Architecture & Legacy Endpoints
router.post('/synthesize-architecture', synthesizeArchitecture);
router.post('/generate-ideas', generateIdeasLegacy);

export default router;
