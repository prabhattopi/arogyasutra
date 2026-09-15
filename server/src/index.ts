import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { connectDatabase } from './db/connection';
import healthRouter from './routes/health';
import analyzeRouter from './routes/analyze';
import historyRouter from './routes/history';
import chatRouter from './routes/chat';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Route Mounts
app.use('/api/health', healthRouter);
app.use('/api/reports/analyze', analyzeRouter);
app.use('/api/reports', historyRouter);
app.use('/api/biomarkers', historyRouter);
app.use('/api/chat', chatRouter);

// Root greeting
app.get('/', (_req, res) => {
  res.json({
    message: '🏥 ArogyaSutra Backend Orchestrator is Running.',
    documentation: '/api/health',
    hackathon: 'Hack2Heal 2.0 Global Healthcare Innovation Hackathon',
  });
});

// Start Server
async function startServer() {
  await connectDatabase();

  app.listen(ENV.PORT, () => {
    console.log(`\n🚀 [ArogyaSutra] Backend Orchestrator listening on http://localhost:${ENV.PORT}`);
    console.log(`🧠 [ArogyaSutra] Ollama Engine Target: ${ENV.OLLAMA_HOST} (Model: ${ENV.OLLAMA_MODEL})`);
    console.log(`🌐 [ArogyaSutra] Diagnostic Healthcheck: http://localhost:${ENV.PORT}/api/health\n`);
  });
}

startServer();
