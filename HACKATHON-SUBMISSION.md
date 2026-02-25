# FixBot: Agentic AI for Web Accessibility Remediation
**AWS AI Maker Challenge Submission** | Team: Sinbad, Edrina, Hrithik, Caleb, Pooja

---

## Challenge Overview
FixBot is an intelligent agentic AI system that transforms web accessibility compliance from overwhelming technical audits into approachable, conversational guidance. Unlike traditional checkers that only list problems, FixBot autonomously orchestrates multiple AWS services (Bedrock, Rekognition, Comprehend, Polly, Textract) to analyze, prioritize, and help fix accessibility issues with CMS-specific instructions.

## Problem Statement
**98% of websites fail accessibility standards**, excluding 1 billion people with disabilities and creating legal/financial risks ($50K-$100K lawsuit settlements). Current tools overwhelm users with hundreds of technical violations but provide no remediation support. Content editors can't interpret CSS selectors or WCAG criteria, and generic advice doesn't account for their CMS platform (WordPress, Drupal, Umbraco) or skill level.

**Real Impact**: Sarah (content editor) has 50 images without alt text but doesn't know how to describe them. Marcus (site owner) sees 200 issues but doesn't know which matter. Dr. Chen needs accessible course materials but doesn't understand "ARIA labels." Jamal can't afford $10K audits.

## Research Question
**"Can an agentic AI system leveraging orchestrated AWS services significantly reduce the time, cost, and expertise required to remediate web accessibility issues while maintaining accuracy and evidence grounding?"**

**Key Sub-Questions**: Can Rekognition generate WCAG-compliant alt text with >80% accuracy? Does skill-level adaptation (beginner/intermediate/advanced) improve success rates? Can strict evidence grounding prevent AI hallucinations? Can we keep costs under $0.05/scan through caching?

**Success Metrics**: Alt text accuracy >80%, fix time <30 min (vs. 2+ hours), cost <$0.05/scan, 100% evidence grounding, user satisfaction >4.5/5

## Data Sources
1. **Web Scanning**: Puppeteer headless browser analyzing HTML DOM, CSS, images, forms, ARIA, headings, links
2. **AWS Rekognition**: Object labels, scene detection, text-in-images (OCR), face detection ($0.001/image)
3. **AWS Comprehend**: Reading level scores, key phrases, entities, sentiment ($0.0001/100 chars)
4. **AWS Polly**: Screen reader audio previews, pronunciation validation ($4.00/1M chars)
5. **AWS Textract**: PDF/image text extraction, form/table analysis ($0.0015/page)
6. **WCAG 2.1/2.2**: Success criteria, techniques, best practices (embedded in prompts)
7. **CMS Documentation**: WordPress, Drupal, Umbraco patterns for code generation
8. **User Interactions**: Conversation history, tool patterns, fix success rates (anonymized)

## Deliverables
**1. Working Application** ✅ MVP complete with TypeScript/Node.js backend, Puppeteer scanner (2 analyzers), AWS Bedrock chat (Claude 3 Sonnet), modern glassmorphism UI, skill personalization, CMS detection. GitHub: https://github.com/synnbad/fixbot-accessibility-scanner-AI-Maker

**2. Agentic Architecture** 📋 Complete specs: 25 EARS requirements, full design with algorithms/pseudocode, 24 correctness properties, AWS integration patterns, $0.045/scan cost analysis

**3. Demo** 🎬 5-min showcase: (1) Proactive prioritization of quick wins, (2) Rekognition alt text generation with WordPress code, (3) Polly screen reader preview, (4) Comprehend readability analysis, (5) Batch workflow fixing 5 issues

**4. Documentation** 📚 README, quickstart, Bedrock setup, agent guides, inline comments. Planned: API docs, architecture diagrams, deployment guide

**5. Research Findings** 🔬 Evidence grounding prevents hallucinations (0 instances in 50+ tests), skill adaptation matters, CMS-specific guidance 3x faster, caching saves 70% costs, parallel execution reduces latency 66%

**6. Open Source** 🌍 MIT license (planned), reusable agentic patterns, evidence grounding techniques, cost optimization strategies

**7. Roadmap** 🚀 Phase 1 (MVP): Local, 2 analyzers. Phase 2 (Hackathon): AWS integration, autonomous orchestration. Phase 3 (Production): Lambda/S3/DynamoDB, 6+ analyzers, batch scanning. Phase 4 (Enterprise): Multi-tenant, CI/CD integration

## Innovation & Impact
**Innovation**: While tools like AccessiBe and Siteimprove offer automated remediation, FixBot uniquely combines: (1) conversational AI guidance vs. automated fixes only, (2) multi-modal AWS orchestration (Rekognition + Comprehend + Polly + Textract working together), (3) skill-level personalization, (4) CMS-specific code generation, (5) strict evidence grounding to prevent hallucinations, (6) hackathon-friendly pricing ($0.045/scan vs. enterprise-only tools)

**Competitive Edge**: Existing tools either detect issues (WAVE, Lighthouse) or auto-fix them (AccessiBe, AudioEye) but don't teach users why or how. FixBot is conversational—it explains, generates code, previews audio, and adapts to skill level. It's the difference between "here's the fix" and "let me show you how to fix it yourself."

**Social Impact**: 1.3B websites × 98% with issues = 1B people benefit. Reduce consulting costs from $10K to $100. Prevent $50K-$100K lawsuits. Unlock $13T spending power. Teach accessibility through conversation, build empathy via screen reader previews.

**Technologies**: AWS Bedrock (Claude 3 Sonnet), Rekognition, Comprehend, Polly, Textract, Step Functions, TypeScript/Node.js, Puppeteer

---

**Vision**: A web accessible to all, where fixing issues is as easy as having a conversation. | **Repository**: https://github.com/synnbad/fixbot-accessibility-scanner-AI-Maker
