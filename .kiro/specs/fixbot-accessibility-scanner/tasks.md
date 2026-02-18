# Implementation Tasks: FixBot Accessibility Scanner

## Phase 1: Foundation & Infrastructure

### 1. Project Setup
- [x] 1.1 Initialize project structure with TypeScript configuration
- [x] 1.2 Set up AWS CDK or Terraform for infrastructure as code
- [x] 1.3 Configure local development environment with LocalStack
- [x] 1.4 Create environment configuration system (local vs AWS)
- [x] 1.5 Set up demo dataset with 3-5 known URLs

### 2. Storage Layer Implementation
- [ ] 2.1 Create S3 bucket structure for report storage
- [ ] 2.2 Create DynamoDB table with GSI for scan metadata
- [ ] 2.3 Implement storage service with S3 and DynamoDB clients
- [ ] 2.4 Write unit tests for storage operations
- [ ] 2.5 Test local storage with LocalStack

### 3. Scanner Service - Core Infrastructure
- [ ] 3.1 Set up headless browser (Puppeteer/Playwright) in Lambda/container
- [ ] 3.2 Implement page fetching with timeout and error handling
- [ ] 3.3 Create base IssueAnalyzer interface and analyzer registry
- [ ] 3.4 Implement CMS detection service with heuristics
- [ ] 3.5 Write unit tests for CMS detection
- [ ] 3.6 Implement scoring model with weighted deductions
- [ ] 3.7 Write unit tests for scoring calculations

## Phase 2: Issue Analyzers (MVP Checks)

### 4. Alt Text Analyzer
- [ ] 4.1 Implement missing alt text detection
- [ ] 4.2 Integrate AWS Bedrock for alt text quality analysis
- [ ] 4.3 Create evidence extraction for image issues
- [ ] 4.4 Write unit tests for alt text analyzer
- [ ] 4.5 Test with demo pages containing image issues

### 5. Heading Structure Analyzer
- [ ] 5.1 Implement heading hierarchy validation
- [ ] 5.2 Detect skipped heading levels
- [ ] 5.3 Detect multiple H1 elements
- [ ] 5.4 Detect empty headings
- [ ] 5.5 Write unit tests for heading analyzer

### 6. Link Text Analyzer
- [ ] 6.1 Implement empty link text detection
- [ ] 6.2 Implement generic link text detection ("click here", etc.)
- [ ] 6.3 Implement duplicate link text detection
- [ ] 6.4 Create evidence extraction for link issues
- [ ] 6.5 Write unit tests for link analyzer

### 7. Form Label Analyzer
- [ ] 7.1 Implement form input detection
- [ ] 7.2 Check for label associations (for/id, wrapping, ARIA)
- [ ] 7.3 Create evidence extraction for form issues
- [ ] 7.4 Write unit tests for form analyzer

### 8. Content Quality Analyzer
- [ ] 8.1 Implement wall-of-text detection (300+ word paragraphs)
- [ ] 8.2 Implement vague heading detection
- [ ] 8.3 Filter out navigation and footer content
- [ ] 8.4 Write unit tests for content quality analyzer

## Phase 3: Report Generation & API

### 9. Report Generation
- [ ] 9.1 Implement report builder that aggregates analyzer results
- [ ] 9.2 Generate report JSON matching schema
- [ ] 9.3 Store reports in S3 with correct key structure
- [ ] 9.4 Store metadata in DynamoDB
- [ ] 9.5 Write integration tests for end-to-end scan flow
- [ ] 9.6 Test deterministic scoring with repeated scans

### 10. API Gateway & Endpoints
- [ ] 10.1 Set up API Gateway with REST endpoints
- [ ] 10.2 Implement POST /scans endpoint with URL validation
- [ ] 10.3 Implement GET /scans endpoint with pagination
- [ ] 10.4 Implement GET /scans/{scanId} endpoint
- [ ] 10.5 Implement error handling and HTTP status codes
- [ ] 10.6 Write API integration tests

### 11. Batch Scanning
- [ ] 11.1 Implement scan queue using EventBridge or SQS
- [ ] 11.2 Implement parallel processing with concurrency limit
- [ ] 11.3 Handle partial failures in batch scans
- [ ] 11.4 Test batch scanning with multiple URLs

## Phase 4: FixBot Chat (Premier Feature)

### 12. FixBot Core Implementation
- [ ] 12.1 Implement POST /chat endpoint
- [ ] 12.2 Create RAG context construction from report
- [ ] 12.3 Build system prompt with grounding rules
- [ ] 12.4 Integrate AWS Bedrock (Claude/Titan) for chat
- [ ] 12.5 Implement response validation for citations
- [ ] 12.6 Write unit tests for prompt construction

### 13. FixBot Grounding & Guardrails
- [ ] 13.1 Implement evidence citation extraction
- [ ] 13.2 Implement out-of-scope question detection
- [ ] 13.3 Implement refusal responses for ungrounded questions
- [ ] 13.4 Test grounding with questions about non-existent issues
- [ ] 13.5 Test refusal behavior with off-topic questions

### 14. CMS-Specific Guidance
- [ ] 14.1 Create guidance templates for WordPress (Gutenberg)
- [ ] 14.2 Create guidance templates for Drupal
- [ ] 14.3 Create guidance templates for Umbraco
- [ ] 14.4 Create fallback guidance for unknown CMS
- [ ] 14.5 Implement CMS-aware response generation
- [ ] 14.6 Test CMS-specific guidance with different platforms

### 15. FixBot Personality & Tone
- [ ] 15.1 Refine system prompt for engaging, encouraging tone
- [ ] 15.2 Add celebration responses for user progress
- [ ] 15.3 Add step-by-step breakdown for complex issues
- [ ] 15.4 Test tone consistency across different question types

## Phase 5: Dashboard

### 16. Dashboard - Scan History
- [ ] 16.1 Create scan history list view component
- [ ] 16.2 Implement pagination for scan history
- [ ] 16.3 Display scan metadata (URL, score, date, CMS)
- [ ] 16.4 Implement navigation to report detail view
- [ ] 16.5 Add empty state for no scans

### 17. Dashboard - Report Detail View
- [ ] 17.1 Create report detail view component
- [ ] 17.2 Display overall score and category subscores
- [ ] 17.3 Implement issue filtering by severity
- [ ] 17.4 Implement issue filtering by category
- [ ] 17.5 Display evidence viewer for selected issues
- [ ] 17.6 Add "Chat with FixBot" button with prominent placement

### 18. Dashboard - FixBot Chat Interface
- [ ] 18.1 Create chat interface component
- [ ] 18.2 Load report context when opening chat
- [ ] 18.3 Display conversation history
- [ ] 18.4 Implement message sending and response display
- [ ] 18.5 Display citations with links to issues
- [ ] 18.6 Add loading states and error handling

### 19. Dashboard - Recurring Issues View
- [ ] 19.1 Implement GET /recurring-issues endpoint
- [ ] 19.2 Create recurring issues aggregation logic
- [ ] 19.3 Create recurring issues view component
- [ ] 19.4 Display affected URL count per issue
- [ ] 19.5 Add navigation to affected URLs

### 20. Dashboard - Scan Submission
- [ ] 20.1 Create scan submission form
- [ ] 20.2 Implement URL validation
- [ ] 20.3 Support single and batch URL input
- [ ] 20.4 Display scan progress and completion
- [ ] 20.5 Handle scan errors gracefully

## Phase 6: Testing & Polish

### 21. Integration Testing
- [ ] 21.1 Test complete scan → store → display flow
- [ ] 21.2 Test FixBot chat with various question types
- [ ] 21.3 Test batch scanning with failures
- [ ] 21.4 Test deterministic scoring across multiple runs
- [ ] 21.5 Test with all demo dataset URLs

### 22. Error Handling & Resilience
- [ ] 22.1 Implement retry logic with exponential backoff
- [ ] 22.2 Add CloudWatch logging for all components
- [ ] 22.3 Test timeout handling for long-running scans
- [ ] 22.4 Test AWS service unavailability scenarios
- [ ] 22.5 Implement graceful degradation for Bedrock failures

### 23. Demo Preparation
- [ ] 23.1 Verify demo dataset produces consistent results
- [ ] 23.2 Create demo script with key user flows
- [ ] 23.3 Test complete demo path: scan → dashboard → FixBot
- [ ] 23.4 Prepare demo environment reset procedure
- [ ] 23.5 Document demo setup and execution steps

## Phase 7: Stretch Features (Optional)

### 24. Contrast Detection Analyzer*
- [ ]* 24.1 Extract computed foreground and background colors
- [ ]* 24.2 Implement WCAG contrast ratio calculation
- [ ]* 24.3 Detect contrast issues for normal and large text
- [ ]* 24.4 Create evidence with color values and ratios
- [ ]* 24.5 Write unit tests for contrast analyzer

### 25. ARIA Misuse Analyzer*
- [ ]* 25.1 Detect aria-label on non-interactive elements
- [ ]* 25.2 Detect conflicting ARIA roles
- [ ]* 25.3 Detect aria-hidden on focusable elements
- [ ]* 25.4 Create plain-language explanations for ARIA issues
- [ ]* 25.5 Write unit tests for ARIA analyzer

### 26. Readability Metrics Analyzer*
- [ ]* 26.1 Implement Flesch Reading Ease calculation
- [ ]* 26.2 Filter main content from navigation/footer
- [ ]* 26.3 Create readability score interpretation
- [ ]* 26.4 Generate improvement suggestions
- [ ]* 26.5 Write unit tests for readability analyzer

### 27. Common Crawl Integration*
- [ ]* 27.1 Research Common Crawl API and data format
- [ ]* 27.2 Implement Common Crawl fetch as alternative to live fetch
- [ ]* 27.3 Add fetch mode selection in scan request
- [ ]* 27.4 Test with Common Crawl archived pages

## Dependencies

- Tasks 2.x must complete before 9.x (storage needed for reports)
- Tasks 3.x must complete before 4.x-8.x (analyzer infrastructure needed)
- Tasks 4.x-8.x must complete before 9.x (analyzers needed for reports)
- Tasks 9.x must complete before 10.x (reports needed for API)
- Tasks 10.x must complete before 12.x (API needed for chat)
- Tasks 9.x and 10.x must complete before 16.x-20.x (backend needed for dashboard)
- Tasks 12.x-15.x must complete before 18.x (FixBot backend needed for chat UI)

## Testing Strategy

- Unit tests for all analyzers, scoring, and CMS detection
- Integration tests for scan → store → retrieve flow
- FixBot guardrail tests for grounding and refusal behavior
- End-to-end tests with demo dataset
- Deterministic scoring validation with repeated scans

## Team Assignment (5 Members) - 3-DAY HACKATHON

### 🚀 DAY 1: Foundation & Core Scanning (Friday)
**Goal:** Get basic scanning working end-to-end

#### Sinbad - Infrastructure & Scanner Core (Heavy Lifting)
- ✅ 1.1-1.4: Project setup, AWS CDK, LocalStack config
- 2.1-2.3: S3 + DynamoDB setup (skip 2.4-2.5 tests for now)
- 3.1-3.3: Headless browser + page fetching + analyzer interface
- 3.4: CMS detection (basic heuristics only)
- 3.6: Scoring model implementation
- **EOD Target:** Can fetch a page, detect CMS, calculate score

#### Edrina - Core Analyzers (MVP Only)
- 4.1, 4.3: Alt text detection + evidence (skip AI quality for now)
- 5.1-5.4: Heading analyzer (skip 5.5 tests)
- 6.1-6.3: Link text analyzer (skip tests)
- **EOD Target:** 3 analyzers working, generating issues

#### Hrithik - FixBot Backend Foundation
- 12.1: POST /chat endpoint stub
- 12.2-12.3: RAG context + system prompt design
- 12.4: Bedrock integration (basic call working)
- 14.1-14.2: WordPress + Drupal guidance templates
- **EOD Target:** Can send a message, get a grounded response

#### Caleb - Dashboard Skeleton
- 16.1: Scan history list (hardcoded data first)
- 17.1-17.2: Report detail view + score display
- 20.1-20.3: Scan submission form + URL validation
- **EOD Target:** Can submit URL, see mock results

#### Pooja - Integration & Demo Setup
- 1.5: Demo dataset (3 URLs with known issues)
- Help Sinbad with 2.1-2.3 (AWS setup)
- Help Caleb with frontend scaffolding
- **EOD Target:** Demo URLs ready, team unblocked

---

### 🔥 DAY 2: Integration & FixBot (Saturday)
**Goal:** End-to-end flow working, FixBot chat functional

#### Sinbad - API & Report Generation
- 9.1-9.4: Report builder + S3/DynamoDB storage
- 10.1-10.4: API Gateway + all endpoints
- 11.1-11.2: Basic batch scanning (skip queue, just parallel)
- **EOD Target:** Scan → Store → Retrieve working

#### Edrina - Remaining Analyzers + Bedrock
- 7.1-7.3: Form label analyzer
- 8.1-8.3: Content quality analyzer
- 4.2: Bedrock alt text quality (if time)
- Help Hrithik test FixBot responses
- **EOD Target:** 5 analyzers complete, rich reports

#### Hrithik - FixBot Polish & Grounding
- 13.1-13.3: Citation extraction + refusal logic
- 14.3-14.4: Umbraco + fallback guidance
- 15.1-15.2: Personality refinement + celebration responses
- 12.5: Response validation
- **EOD Target:** FixBot fully grounded, CMS-aware, engaging

#### Caleb - Dashboard Integration
- 17.3-17.6: Issue filtering + evidence viewer + FixBot button
- 18.1-18.4: Chat interface + message display
- 16.2-16.4: Real scan history from API
- **EOD Target:** Full dashboard working with real data

#### Pooja - Testing & Bug Fixes
- 21.1: Test scan → store → display flow
- 21.2: Test FixBot with various questions
- 9.6: Test deterministic scoring
- Help team debug integration issues
- **EOD Target:** Core flows validated, bugs logged

---

### 🎯 DAY 3: Polish & Demo Prep (Sunday)
**Goal:** Demo-ready product with wow factor

#### Sinbad - Error Handling & Performance
- 22.1-22.2: Retry logic + CloudWatch logging
- 11.3: Handle batch failures gracefully
- 10.5: Proper error responses
- Help team with any blockers
- **EOD Target:** Stable, production-quality backend

#### Edrina - Stretch Features (if time)
- 24.1-24.3: Contrast detection (high impact for demo)
- OR help Pooja with testing
- OR polish analyzer output quality
- **EOD Target:** One stretch feature OR bulletproof analyzers

#### Hrithik - FixBot Refinement
- 13.4-13.5: Test grounding edge cases
- 14.6: Test all CMS guidance paths
- 15.3-15.4: Complex issue breakdown + tone consistency
- **EOD Target:** FixBot is the star of the demo

#### Caleb - UI Polish & UX
- 18.5-18.6: Citations display + error handling
- 19.1-19.3: Recurring issues view (if time)
- 20.4-20.5: Scan progress + error states
- Visual polish: colors, icons, animations
- **EOD Target:** Beautiful, intuitive UI

#### Pooja - Demo Preparation
- 23.1-23.5: All demo prep tasks
- 21.3-21.5: Final integration tests
- Create demo script with talking points
- Test demo flow 3+ times
- Prepare backup plan for failures
- **EOD Target:** Flawless 5-minute demo ready

---

## Critical Path & Dependencies

**Must Complete Day 1:**
- Sinbad: 1.x, 2.1-2.3, 3.1-3.4, 3.6 (blocks everyone)
- Edrina: 4.1, 5.1-5.4, 6.1-6.3 (blocks report generation)
- Hrithik: 12.1-12.4 (blocks chat UI)

**Must Complete Day 2:**
- Sinbad: 9.x, 10.x (blocks dashboard integration)
- Hrithik: 13.1-13.3, 15.1 (blocks demo wow factor)
- Caleb: 17.x, 18.1-18.4 (blocks demo)

**Day 3 is Polish Only** - if core isn't done by EOD Day 2, skip stretch features

## Hackathon Survival Tips

- **Use Kiro aggressively** - let it write boilerplate, tests, configs
- **Skip unit tests Day 1-2** - focus on integration, test manually
- **Hardcode when needed** - perfect scoring can wait, demo first
- **Pair program blockers** - if someone is stuck >30min, swarm it
- **Cut scope ruthlessly** - recurring issues view is optional, FixBot is not
- **Demo dataset is king** - if it works on 3 URLs, that's enough
- **Sleep 6+ hours** - tired devs write bugs, not features

## Notes

- Tasks marked with * are stretch goals (optional)
- Prioritize FixBot chat quality over additional analyzers
- Focus on demo-friendly implementation over production hardening
- Sinbad handles the heaviest infrastructure work (~33 core tasks)
- Daily standups to sync on dependencies and blockers
