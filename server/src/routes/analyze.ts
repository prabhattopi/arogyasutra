import { Router, Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { ExtractorService } from '../services/extractor.service';
import { GuardrailsService } from '../services/guardrails.service';
import { OllamaService } from '../services/ollama.service';
import { ReportModel, inMemoryReports, IReport } from '../models/Report';
import { isConnectedToDb, ensureDatabaseConnection } from '../db/connection';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const router = Router();

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    let rawText = '';
    const language = (req.query.language as string) || req.body.language || 'en';
    const isStream = req.query.stream === 'true' || req.headers.accept === 'text/event-stream';

    // 1. Ingest text from file or body
    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        const pdfData = await pdfParse(req.file.buffer);
        rawText = pdfData.text;
      } else {
        rawText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text && typeof req.body.text === 'string') {
      rawText = req.body.text;
    }

    if (!rawText || rawText.trim() === '') {
      res.status(400).json({ error: 'Please provide lab report text or upload a valid PDF/TXT file.' });
      return;
    }

    // 2. Extract Metadata & Biomarkers
    const metadata = ExtractorService.extractMetadata(rawText);
    const biomarkers = ExtractorService.extractBiomarkers(rawText);
    const doctorQuestions = GuardrailsService.generateDoctorQuestions(biomarkers);

    const systemPrompt = GuardrailsService.getSystemPrompt(language);
    const userPrompt = GuardrailsService.buildUserPrompt(biomarkers, metadata.reportType, language);

    // 3. Handle Streaming Response via SSE
    if (isStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      // Emit initial parsed biomarkers and structure
      const initialPayload = {
        metadata,
        biomarkers,
        doctorQuestions,
      };
      res.write(`event: init\ndata: ${JSON.stringify(initialPayload)}\n\n`);

      // Stream LLM tokens
      let fullSummary = '';
      fullSummary = await OllamaService.streamAnalysis(
        systemPrompt,
        userPrompt,
        biomarkers,
        language,
        (tokenChunk: string) => {
          res.write(`event: token\ndata: ${JSON.stringify({ token: tokenChunk })}\n\n`);
        }
      );

      // Save Report into MongoDB or In-Memory Store
      const reportData = {
        patientName: metadata.patientName,
        patientAge: metadata.patientAge,
        patientSex: metadata.patientSex,
        reportDate: new Date(),
        reportType: metadata.reportType,
        rawText,
        biomarkers,
        plainLanguageSummary: fullSummary,
        doctorQuestions,
      };

      let savedReport: any;
      const dbReady = await ensureDatabaseConnection();
      if (dbReady) {
        try {
          savedReport = await ReportModel.create(reportData);
          console.log(`✔ [MongoDB] Streamed Report persisted with ID: ${savedReport._id}`);
        } catch (dbErr) {
          console.warn('Failed to persist to Mongo, keeping in memory', dbErr);
          savedReport = { ...reportData, _id: 'mem-' + Date.now() };
          inMemoryReports.unshift(savedReport);
        }
      } else {
        savedReport = { ...reportData, _id: 'mem-' + Date.now() };
        inMemoryReports.unshift(savedReport);
      }

      res.write(`event: complete\ndata: ${JSON.stringify({ report: savedReport })}\n\n`);
      res.end();
      return;
    }

    // 4. Standard Non-Streaming JSON Response
    let fullSummary = '';
    fullSummary = await OllamaService.streamAnalysis(
      systemPrompt,
      userPrompt,
      biomarkers,
      language,
      () => {}
    );

    const reportData = {
      patientName: metadata.patientName,
      patientAge: metadata.patientAge,
      patientSex: metadata.patientSex,
      reportDate: new Date(),
      reportType: metadata.reportType,
      rawText,
      biomarkers,
      plainLanguageSummary: fullSummary,
      doctorQuestions,
    };

    let savedReport: any;
    const dbReadySync = await ensureDatabaseConnection();
    if (dbReadySync) {
      try {
        savedReport = await ReportModel.create(reportData);
        console.log(`✔ [MongoDB] Report persisted with ID: ${savedReport._id}`);
      } catch (dbErr) {
        savedReport = { ...reportData, _id: 'mem-' + Date.now() };
        inMemoryReports.unshift(savedReport);
      }
    } else {
      savedReport = { ...reportData, _id: 'mem-' + Date.now() };
      inMemoryReports.unshift(savedReport);
    }

    res.json({
      success: true,
      report: savedReport,
      biomarkers,
      metadata,
      doctorQuestions,
      summary: fullSummary,
    });
  } catch (error: any) {
    console.error('Error analyzing report:', error);
    res.status(500).json({ error: error.message || 'Internal error processing diagnostic report.' });
  }
});

export default router;
