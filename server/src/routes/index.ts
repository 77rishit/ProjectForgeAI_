import { Router } from 'express';
import v1Router from './v1/index.js';

const apiRouter = Router();

// API Version 1
apiRouter.use('/v1', v1Router);

// Direct root mounting for backward compatibility with frontend clients
apiRouter.use('/', v1Router);

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ProjectForge AI Core API Gateway',
    version: '1.0.0',
    supportedVersions: ['v1'],
    timestamp: new Date().toISOString()
  });
});

apiRouter.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

export default apiRouter;

