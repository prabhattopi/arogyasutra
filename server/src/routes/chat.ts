import { Router, Request, Response } from 'express';
import { OllamaService } from '../services/ollama.service';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, report, language } = req.body;
    const isStream = req.query.stream === 'true' || req.headers.accept === 'text/event-stream';

    if (!question || typeof question !== 'string' || question.trim() === '') {
      res.status(400).json({ error: 'Please provide a valid question.' });
      return;
    }

    if (isStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const fullAnswer = await OllamaService.chatWithReport(
        question,
        report || {},
        language || 'en',
        (token: string) => {
          res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
        }
      );

      res.write(`event: done\ndata: ${JSON.stringify({ answer: fullAnswer })}\n\n`);
      res.end();
      return;
    }

    const answer = await OllamaService.chatWithReport(
      question,
      report || {},
      language || 'en',
      () => {}
    );

    res.json({ success: true, answer });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Error generating answer.' });
  }
});

export default router;
