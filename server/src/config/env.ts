import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/projectforge',
  JWT_SECRET: process.env.JWT_SECRET || 'projectforge_super_secure_jwt_dev_secret_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Legacy/Fallback Provider Options
  AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  AI_RATE_LIMIT_PER_MINUTE: process.env.AI_RATE_LIMIT_PER_MINUTE
    ? parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE, 10)
    : 30
};
