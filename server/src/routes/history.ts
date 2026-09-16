import { Router, Request, Response } from 'express';
import { ReportModel, inMemoryReports } from '../models/Report';
import { isConnectedToDb, ensureDatabaseConnection } from '../db/connection';

const router = Router();

// Seed baseline longitudinal history for impressive immediate hackathon demonstration
const SEED_TRENDS = [
  {
    date: '2026-03-15',
    label: '6 Months Ago',
    hemoglobin: 11.2,
    glucose: 145,
    hba1c: 7.4,
    cholesterol: 230,
    wbc: 8500,
    creatinine: 1.1,
  },
  {
    date: '2026-06-10',
    label: '3 Months Ago',
    hemoglobin: 10.5,
    glucose: 158,
    hba1c: 7.9,
    cholesterol: 242,
    wbc: 9200,
    creatinine: 1.25,
  },
  {
    date: '2026-09-06',
    label: 'Current Visit',
    hemoglobin: 9.4,
    glucose: 168,
    hba1c: 8.2,
    cholesterol: 252,
    wbc: 13800,
    creatinine: 1.45,
  },
];

/**
 * GET all past analyzed reports
 */
router.get('/history', async (_req: Request, res: Response) => {
  try {
    let reports: any[] = [];
    const dbReady = await ensureDatabaseConnection();
    if (dbReady) {
      reports = await ReportModel.find().sort({ createdAt: -1 }).limit(20);
    } else {
      reports = [...inMemoryReports];
    }
    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch report history' });
  }
});

/**
 * GET single report by ID
 */
router.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let report: any = null;

    if (isConnectedToDb && !id.startsWith('mem-')) {
      report = await ReportModel.findById(id);
    } else {
      report = inMemoryReports.find((r) => r._id === id || r.id === id);
    }

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch report' });
  }
});

/**
 * GET longitudinal biomarker trends
 */
router.get('/trends', async (_req: Request, res: Response) => {
  try {
    // If reports exist in database or memory, we extract biomarkers over time
    let reports: any[] = [];
    if (isConnectedToDb) {
      reports = await ReportModel.find().sort({ createdAt: 1 }).limit(10);
    } else {
      reports = [...inMemoryReports].reverse();
    }

    if (reports.length >= 2) {
      const dynamicTrends = reports.map((rep, idx) => {
        const findVal = (nameKeyword: string) => {
          const match = rep.biomarkers?.find((b: any) =>
            b.name.toLowerCase().includes(nameKeyword.toLowerCase())
          );
          return match ? match.value : null;
        };

        const dateStr = rep.reportDate
          ? new Date(rep.reportDate).toISOString().split('T')[0]
          : `Visit ${idx + 1}`;

        return {
          date: dateStr,
          label: `Visit ${idx + 1} (${dateStr})`,
          hemoglobin: findVal('hemoglobin'),
          glucose: findVal('glucose'),
          hba1c: findVal('hba1c'),
          cholesterol: findVal('cholesterol'),
          wbc: findVal('leukocyte') || findVal('wbc'),
          creatinine: findVal('creatinine'),
        };
      });

      res.json({ trends: dynamicTrends });
      return;
    }

    // Default to realistic baseline trend set for pristine video demonstration
    res.json({ trends: SEED_TRENDS });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch biomarker trends' });
  }
});

export default router;
