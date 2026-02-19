import puppeteer, { Page } from 'puppeteer';
import { Report, CMSInfo, ScoreBreakdown, Issue } from './types';
import { v4 as uuidv4 } from 'uuid';
import { analyzeAltText } from './analyzers/altTextAnalyzer';
import { analyzeHeadings } from './analyzers/headingAnalyzer';

export async function scanUrl(url: string): Promise<Report> {
  console.log(`Starting scan for: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Run analyzers
    const issues: Issue[] = [];
    issues.push(...(await analyzeAltText(page)));
    issues.push(...(await analyzeHeadings(page)));

    // Detect CMS
    const cms = await detectCMS(page);

    // Calculate scores
    const scores = calculateScores(issues);

    const report: Report = {
      scanId: uuidv4(),
      url,
      timestamp: new Date().toISOString(),
      scores,
      cms,
      issues,
    };

    console.log(`Scan complete. Found ${issues.length} issues. Score: ${scores.overall}`);
    return report;
  } finally {
    await browser.close();
  }
}

async function detectCMS(page: Page): Promise<CMSInfo> {
  try {
    // Check meta generator tag
    const generator = await page.$eval('meta[name="generator"]', (el) =>
      el.getAttribute('content')
    ).catch(() => null);

    if (generator) {
      if (generator.toLowerCase().includes('wordpress')) {
        return { platform: 'wordpress', confidence: 'high' };
      }
      if (generator.toLowerCase().includes('drupal')) {
        return { platform: 'drupal', confidence: 'high' };
      }
      if (generator.toLowerCase().includes('umbraco')) {
        return { platform: 'umbraco', confidence: 'high' };
      }
    }

    // Check for WordPress-specific classes
    const hasWpClasses = await page.evaluate(() => {
      const body = document.body;
      if (!body) return false;
      return body.className.includes('wp-') || 
             !!document.querySelector('.wp-block-');
    });

    if (hasWpClasses) {
      return { platform: 'wordpress', confidence: 'medium' };
    }

    // Check for Drupal-specific patterns
    const hasDrupalClasses = await page.evaluate(() => {
      const body = document.body;
      if (!body) return false;
      return body.className.includes('drupal') ||
             !!document.querySelector('[data-drupal-selector]');
    });

    if (hasDrupalClasses) {
      return { platform: 'drupal', confidence: 'medium' };
    }

  } catch (error) {
    console.log('CMS detection error:', error);
  }

  return { platform: 'unknown', confidence: 'none' };
}

function calculateScores(issues: Issue[]): ScoreBreakdown {
  let totalDeduction = 0;
  let accessibilityDeduction = 0;
  let contentQualityDeduction = 0;
  let structureDeduction = 0;

  const severityWeights = {
    critical: 10,
    high: 5,
    moderate: 2,
    low: 0.5,
  };

  issues.forEach((issue) => {
    const deduction = severityWeights[issue.severity];
    totalDeduction += deduction;

    if (issue.category === 'accessibility') {
      accessibilityDeduction += deduction;
    } else if (issue.category === 'content-quality') {
      contentQualityDeduction += deduction;
    } else if (issue.category === 'structure') {
      structureDeduction += deduction;
    }
  });

  return {
    overall: Math.max(0, 100 - totalDeduction),
    categories: {
      accessibility: Math.max(0, 100 - accessibilityDeduction),
      contentQuality: Math.max(0, 100 - contentQualityDeduction),
      structure: Math.max(0, 100 - structureDeduction),
    },
  };
}
