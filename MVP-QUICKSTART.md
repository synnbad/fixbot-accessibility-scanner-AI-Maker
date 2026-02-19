# FixBot MVP - Quick Start Guide

## What's This?

A working MVP of FixBot that demonstrates the core concept:
- ✅ Scans URLs for accessibility issues
- ✅ Generates scored reports
- ✅ FixBot chat assistant with grounding
- ✅ CMS detection (WordPress, Drupal, Umbraco)
- ✅ Simple web interface

## What's Included

**Analyzers (2 of 5):**
- Alt text detection (missing & generic)
- Heading structure (skips, multiple H1s, empty)

**Features:**
- Scoring model with weighted deductions
- CMS detection via meta tags and DOM patterns
- FixBot chat with keyword-based responses (mock AI)
- Local JSON storage (no AWS needed for demo)

## Installation & Run

```bash
# Install dependencies
npm install

# Run the server
npm run dev

# Open browser
# Visit: http://localhost:3000
```

## Try It Out

1. **Scan a URL:**
   - Enter any public URL (try https://example.com)
   - Click "Scan Now"
   - Wait 10-30 seconds

2. **View Report:**
   - See overall score and category breakdowns
   - Review detected issues with evidence
   - Check CMS detection results

3. **Chat with FixBot:**
   - Ask: "What issues did you find?"
   - Ask: "Tell me about the image problems"
   - Ask: "How do I fix the headings?"
   - Try asking about something not in the report (it will refuse!)

## Demo URLs to Try

- https://example.com (basic site)
- https://www.w3.org/WAI/demos/bad/ (intentionally bad accessibility)
- Any WordPress site (to test CMS detection)

## What's Different from Full Spec?

**Simplified for MVP:**
- Local JSON storage instead of S3/DynamoDB
- Mock FixBot responses instead of AWS Bedrock
- Only 2 analyzers instead of 5+
- No batch scanning
- Basic frontend instead of full dashboard

**Still demonstrates:**
- Core scanning flow
- Evidence-based reporting
- FixBot grounding (refuses off-topic questions)
- CMS-aware guidance
- Scoring model

## Next Steps for Hackathon

1. **Add AWS Integration:**
   - Replace `storage.ts` with S3/DynamoDB
   - Replace `fixbot.ts` with AWS Bedrock calls

2. **Add More Analyzers:**
   - Link text quality
   - Form labels
   - Content quality

3. **Enhance Frontend:**
   - Better UI/UX
   - Scan history view
   - Recurring issues aggregation

4. **Production Features:**
   - Error handling & retries
   - Batch scanning
   - API authentication

## File Structure

```
src/
├── index.ts              # Express server & API endpoints
├── scanner.ts            # Main scanning orchestrator
├── storage.ts            # Local JSON storage
├── fixbot.ts             # Chat response generator
├── types.ts              # TypeScript interfaces
└── analyzers/
    ├── altTextAnalyzer.ts
    └── headingAnalyzer.ts

public/
└── index.html            # Demo frontend

data/
└── reports.json          # Stored scan results (auto-created)
```

## Estimated Time to Build This MVP

- With Kiro: ~2-3 hours ✅
- Without Kiro: ~6-8 hours

## Questions?

This MVP proves the concept works. Use it to:
- Show your team what we're building
- Test the user flow
- Validate the architecture
- Get feedback before the hackathon

Ready to scale it up! 🚀
