import { Page } from 'puppeteer';
import { Issue } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function analyzeAltText(page: Page): Promise<Issue[]> {
  const issues: Issue[] = [];

  // Find all images
  const images = await page.$$eval('img', (imgs) =>
    imgs.map((img, index) => ({
      src: img.src,
      alt: img.alt,
      hasAlt: img.hasAttribute('alt'),
      index: index + 1,
    }))
  );

  for (const img of images) {
    // Missing alt text
    if (!img.hasAlt || img.alt.trim() === '') {
      issues.push({
        id: uuidv4(),
        title: 'Missing alt text on image',
        category: 'accessibility',
        severity: 'critical',
        description: `This image doesn't have alt text, which means screen reader users won't know what it shows.`,
        whyItMatters: 'Alt text helps people who can\'t see images understand your content.',
        evidence: {
          selector: `img:nth-of-type(${img.index})`,
          snippet: `<img src="${img.src.substring(0, 50)}...">`,
          location: `Image #${img.index}`,
        },
        suggestedFix: 'Add an alt attribute that describes what the image shows. For example: alt="Person typing on laptop"',
      });
    }
    // Generic alt text
    else if (['image', 'photo', 'picture', 'img'].includes(img.alt.toLowerCase())) {
      issues.push({
        id: uuidv4(),
        title: 'Generic alt text on image',
        category: 'accessibility',
        severity: 'moderate',
        description: `This image has generic alt text ("${img.alt}") that doesn't describe what it shows.`,
        whyItMatters: 'Descriptive alt text helps everyone understand your images better.',
        evidence: {
          selector: `img:nth-of-type(${img.index})`,
          snippet: `<img src="${img.src.substring(0, 50)}..." alt="${img.alt}">`,
          location: `Image #${img.index}`,
        },
        suggestedFix: 'Replace with a description of what the image actually shows.',
      });
    }
  }

  return issues;
}
