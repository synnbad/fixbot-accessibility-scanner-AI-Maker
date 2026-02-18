# FixBot - AI-Powered Accessibility Scanner

> **Status:** Pilot/Planning Phase - Hackathon starts next weekend!

## Overview

FixBot is an AI-powered accessibility and content quality scanner for public webpages. It features an engaging chat assistant that provides CMS-aware remediation guidance, making accessibility compliance approachable for non-technical users.

**Key Features:**
- 🔍 Scans URLs for accessibility & content quality issues
- 🤖 FixBot chat assistant with strict evidence grounding
- 📊 Scored reports with actionable remediation steps
- 🎯 CMS-specific guidance (WordPress, Drupal, Umbraco)
- ☁️ AWS-based serverless architecture

## Hackathon Details

- **Event:** 3-Day AI Maker Challenge (Next Weekend)
- **Team:** 5 members (Sinbad, Edrina, Hrithik, Caleb, Pooja)
- **Tech Stack:** TypeScript, AWS (Lambda, S3, DynamoDB, Bedrock), React/Vue
- **Goal:** Working demo with scan → report → FixBot chat flow

## Project Structure

```
.kiro/specs/fixbot-accessibility-scanner/
├── requirements.md  # 27 requirements with acceptance criteria
├── design.md        # Architecture, data models, component interfaces
└── tasks.md         # 3-day implementation plan with team assignments
```

## Quick Start (For Team Review)

1. **Clone this repo**
   ```bash
   git clone <repo-url>
   cd fixbot
   ```

2. **Review the spec**
   - Read `requirements.md` for product vision
   - Check `design.md` for technical architecture
   - Find your tasks in `tasks.md` under your name

3. **Provide feedback**
   - Open issues for questions or concerns
   - Suggest changes via PR
   - Comment on task assignments

## Team Assignments

| Team Member | Focus Area | Day 1 Priority |
|-------------|------------|----------------|
| **Sinbad** | Infrastructure & Scanner Core | AWS setup, headless browser, CMS detection |
| **Edrina** | Issue Analyzers | Alt text, headings, links analyzers |
| **Hrithik** | FixBot Chat Backend | Bedrock integration, RAG, grounding |
| **Caleb** | Dashboard Frontend | Scan history, report view, chat UI |
| **Pooja** | Testing & Demo Prep | Demo dataset, integration testing |

## Pre-Hackathon Checklist

- [ ] All team members review spec documents
- [ ] AWS account setup with Bedrock access
- [ ] Agree on tech stack details (React vs Vue, etc.)
- [ ] Install development tools (Node.js, Puppeteer, AWS CLI)
- [ ] Test Kiro AI assistant access
- [ ] Identify 3-5 demo URLs with accessibility issues
- [ ] Schedule Day 1 kickoff time

## Resources

- **Spec Location:** `.kiro/specs/fixbot-accessibility-scanner/`
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **AWS Bedrock Docs:** https://docs.aws.amazon.com/bedrock/
- **Puppeteer Docs:** https://pptr.dev/

## Questions?

Open an issue or discuss in team chat. Let's make this hackathon a success! 🚀

---

**Note:** This is a pilot repository for planning. Actual implementation starts at the hackathon.
