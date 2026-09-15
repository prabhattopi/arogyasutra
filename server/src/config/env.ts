import dotenv from 'dotenv';
import path from 'path';

// Load root .env or server .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2:1b',
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
