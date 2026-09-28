import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';
import { runSeed } from './seed/seedRunner.js';

const app = express();

// Security and middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin, curl, mobile, or production requests
      if (!origin || process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }
      const allowedOrigins = [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Serve frontend static files if dist directory exists (production hosting)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Single Page Application (SPA) fallback for client-side routes
  app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();

    // Check if seed is needed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] No users detected in database. Executing initial seed...');
      await runSeed();
    } else {
      console.log(`[Server] Database ready with ${userCount} existing users.`);
    }

    app.listen(ENV.PORT, () => {
      console.log(`🚀 [ProjectForge AI Server] Listening on http://localhost:${ENV.PORT}`);
      console.log(`📡 [API Health] http://localhost:${ENV.PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
}

startServer();
