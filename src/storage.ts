import { Report } from './types';
import * as fs from 'fs';
import * as path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data');
const REPORTS_FILE = path.join(STORAGE_DIR, 'reports.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export function saveReport(report: Report): void {
  const reports = getAllReports();
  reports.push(report);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
  console.log(`Report saved: ${report.scanId}`);
}

export function getReport(scanId: string): Report | null {
  const reports = getAllReports();
  return reports.find((r) => r.scanId === scanId) || null;
}

export function getAllReports(): Report[] {
  if (!fs.existsSync(REPORTS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(REPORTS_FILE, 'utf-8');
  return JSON.parse(data);
}
