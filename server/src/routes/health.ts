import { Router, Request, Response } from 'express';
import { OllamaService } from '../services/ollama.service';
import { isConnectedToDb } from '../db/connection';
import { ENV } from '../config/env';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const ollamaStatus = await OllamaService.checkHealth();

  res.json({
    status: 'online',
    service: 'ArogyaSutra Orchestrator',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: isConnectedToDb,
      mode: isConnectedToDb ? 'Local Docker MongoDB (100% Air-Gapped)' : 'In-Memory Local Mode (Ready)',
    },
    ollama: {
      online: ollamaStatus.online,
      host: ENV.OLLAMA_HOST,
      activeModel: ollamaStatus.activeModel,
      availableModels: ollamaStatus.availableModels,
      error: ollamaStatus.error,
    },
  });
});

export default router;
