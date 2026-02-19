import express from 'express';
import cors from 'cors';
import { scanUrl } from './scanner';
import { saveReport, getReport, getAllReports } from './storage';
import { generateFixBotResponse } from './fixbot';
import { ScanRequest, ChatRequest } from './types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// POST /scan - Scan a URL
app.post('/api/scan', async (req, res) => {
  try {
    const { url } = req.body as ScanRequest;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Received scan request for: ${url}`);
    const report = await scanUrl(url);
    saveReport(report);

    res.json({ scanId: report.scanId, message: 'Scan complete' });
  } catch (error: any) {
    console.error('Scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /scans - Get all scans
app.get('/api/scans', (req, res) => {
  try {
    const reports = getAllReports();
    const summary = reports.map((r) => ({
      scanId: r.scanId,
      url: r.url,
      timestamp: r.timestamp,
      score: r.scores.overall,
      cms: r.cms.platform,
      issueCount: r.issues.length,
    }));
    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /scans/:scanId - Get specific report
app.get('/api/scans/:scanId', (req, res) => {
  try {
    const { scanId } = req.params;
    const report = getReport(scanId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error: any) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /chat - Chat with FixBot
app.post('/api/chat', (req, res) => {
  try {
    const { scanId, message, userProfile } = req.body as ChatRequest;

    if (!scanId || !message) {
      return res.status(400).json({ error: 'scanId and message are required' });
    }

    const report = getReport(scanId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const response = generateFixBotResponse(report, message, userProfile);
    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FixBot MVP running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   POST /api/scan - Scan a URL`);
  console.log(`   GET  /api/scans - List all scans`);
  console.log(`   GET  /api/scans/:scanId - Get report details`);
  console.log(`   POST /api/chat - Chat with FixBot`);
});
