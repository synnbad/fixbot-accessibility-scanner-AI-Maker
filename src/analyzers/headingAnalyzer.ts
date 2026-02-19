import { Page } from 'puppeteer';
import { Issue } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function analyzeHeadings(page: Page): Promise<Issue[]> {
  const issues: Issue[] = [];

  // Get all headings
  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
    elements.map((el, index) => ({
      level: parseInt(el.tagName.substring(1)),
      text: el.textContent?.trim() || '',
      tagName: el.tagName,
      index: index + 1,
    }))
  );

  if (headings.length === 0) return issues;

  // Check for multiple H1s
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count > 1) {
    issues.push({
      id: uuidv4(),
      title: 'Multiple H1 headings found',
      category: 'structure',
      severity: 'moderate',
      description: `This page has ${h1Count} H1 headings. Pages should typically have only one main heading.`,
      whyItMatters: 'Multiple H1s can confuse screen reader users about the main topic of the page.',
      evidence: {
        selector: 'h1',
        snippet: `Found ${h1Count} H1 elements`,
        location: 'Page structure',
      },
      suggestedFix: 'Use only one H1 for the main page title. Use H2-H6 for subheadings.',
    });
  }

  // Check for skipped heading levels
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];
    const levelDiff = current.level - previous.level;

    if (levelDiff > 1) {
      issues.push({
        id: uuidv4(),
        title: 'Skipped heading level',
        category: 'structure',
        severity: 'moderate',
        description: `Heading jumps from ${previous.tagName} to ${current.tagName}, skipping a level.`,
        whyItMatters: 'Skipping heading levels makes it harder for screen reader users to understand page structure.',
        evidence: {
          selector: `${current.tagName.toLowerCase()}:nth-of-type(${current.index})`,
          snippet: `${previous.tagName}: "${previous.text}" → ${current.tagName}: "${current.text}"`,
          location: `Heading #${current.index}`,
        },
        suggestedFix: `Use ${previous.tagName} followed by H${previous.level + 1} instead of jumping to ${current.tagName}.`,
      });
    }
  }

  // Check for empty headings
  headings.forEach((heading) => {
    if (heading.text === '') {
      issues.push({
        id: uuidv4(),
        title: 'Empty heading',
        category: 'structure',
        severity: 'high',
        description: `This ${heading.tagName} heading is empty.`,
        whyItMatters: 'Empty headings confuse screen reader users and provide no information.',
        evidence: {
          selector: `${heading.tagName.toLowerCase()}:nth-of-type(${heading.index})`,
          snippet: `<${heading.tagName}></${heading.tagName}>`,
          location: `Heading #${heading.index}`,
        },
        suggestedFix: 'Add descriptive text to the heading or remove it if not needed.',
      });
    }
  });

  return issues;
}
