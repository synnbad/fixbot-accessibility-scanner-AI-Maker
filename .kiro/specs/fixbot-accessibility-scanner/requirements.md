# Requirements Document: FixBot Accessibility Scanner

## Introduction

FixBot is an AI-powered accessibility and content quality scanner centered around an engaging chat assistant that makes website accessibility fun and approachable. The system scans URLs and generates scored reports, but the premier feature is FixBot - a friendly, CMS-aware chat assistant that breaks down issues, guides users through practical remediation steps, and makes WCAG compliance feel less like a chore. FixBot is strictly grounded to only discuss the scanned URL to ensure accuracy and avoid hallucinations. The system is designed for faculty members, students, and site owners with little to no accessibility knowledge who need simple, practical, and engaging guidance to make their websites more accessible.

## Glossary

- **Scanner**: The component that fetches and analyzes webpage content for accessibility and quality issues
- **Report**: A structured document containing scan results, scores, issues, and metadata for a single URL
- **Issue**: A detected accessibility or content quality problem with severity, evidence, and remediation guidance
- **FixBot**: The AI chat assistant that provides evidence-grounded remediation guidance
- **Dashboard**: The web interface for viewing scan history, reports, and interacting with FixBot
- **CMS**: Content Management System (WordPress, Drupal, Umbraco, etc.)
- **Evidence**: The specific DOM selector and content snippet that demonstrates an issue
- **Grounding**: The requirement that FixBot responses must cite specific issues and evidence from scanned reports

## Requirements

### Requirement 1: URL Scanning

**User Story:** As a site owner, I want to scan single or multiple URLs, so that I can identify accessibility and content quality issues on my webpages.

#### Acceptance Criteria

1. WHEN a user submits a single valid URL, THE Scanner SHALL fetch the rendered webpage and analyze it for issues
2. WHEN a user submits a batch of URLs (up to 25), THE Scanner SHALL process each URL and generate individual reports
3. WHEN a URL cannot be fetched, THE Scanner SHALL record the failure with error details and continue processing remaining URLs
4. WHEN scanning a URL, THE Scanner SHALL use a headless browser to obtain the fully rendered DOM and computed styles
5. WHEN a scan completes, THE Scanner SHALL store the report in S3 and index metadata in DynamoDB

### Requirement 2: Alt Text Analysis

**User Story:** As a site owner, I want the scanner to detect missing and low-quality image descriptions, so that I can ensure images are accessible to people using screen readers.

#### Acceptance Criteria

1. WHEN the Scanner encounters an image element without alt text, THE Scanner SHALL create an issue with severity "critical" and evidence showing the image location
2. WHEN the Scanner encounters an image with alt text, THE Scanner SHALL evaluate the quality using AI analysis
3. WHEN alt text is generic (e.g., "image", "photo", "picture"), THE Scanner SHALL flag it as low-quality with severity "moderate"
4. WHEN an image is decorative (based on context heuristics), THE Scanner SHALL verify it has empty alt text or role="presentation"
5. WHEN the Scanner detects alt text issues, THE Scanner SHALL include the image source URL in the evidence and explain why it matters in plain language

### Requirement 3: Heading Structure Analysis

**User Story:** As a site owner, I want the scanner to check heading organization, so that I can ensure my page structure makes sense for all users.

#### Acceptance Criteria

1. WHEN the Scanner detects skipped heading levels (e.g., H1 to H3), THE Scanner SHALL create an issue with severity "moderate" and explain why heading order matters
2. WHEN the Scanner detects multiple H1 elements, THE Scanner SHALL create an issue with severity "moderate" and explain the impact on navigation
3. WHEN the Scanner detects empty heading elements, THE Scanner SHALL create an issue with severity "high"
4. WHEN the Scanner analyzes headings, THE Scanner SHALL include the heading text and location in the evidence using non-technical language
5. WHEN heading issues are detected, THE Scanner SHALL suggest the correct heading level with simple examples

### Requirement 4: Link Text Quality Analysis

**User Story:** As a site owner, I want the scanner to identify unclear link text, so that I can make links understandable for everyone.

#### Acceptance Criteria

1. WHEN the Scanner encounters a link with empty text content, THE Scanner SHALL create an issue with severity "critical" and explain why links need text
2. WHEN the Scanner encounters generic link text (e.g., "click here", "read more", "here"), THE Scanner SHALL create an issue with severity "moderate" and explain the problem in simple terms
3. WHEN the Scanner detects duplicate link text pointing to different URLs, THE Scanner SHALL create an issue with severity "moderate" and explain why this confuses users
4. WHEN link issues are detected, THE Scanner SHALL include the link text, destination, and location in the evidence without technical jargon
5. WHEN suggesting fixes, THE Scanner SHALL recommend descriptive link text with easy-to-understand examples

### Requirement 5: Form Label Detection

**User Story:** As a site owner, I want the scanner to detect form inputs without proper labels, so that I can ensure forms are usable by everyone.

#### Acceptance Criteria

1. WHEN the Scanner encounters an input element without an associated label, THE Scanner SHALL create an issue with severity "high" and explain why labels are important
2. WHEN the Scanner detects a label association, THE Scanner SHALL verify it uses either for/id pairing or wrapping structure
3. WHEN an input has aria-label or aria-labelledby, THE Scanner SHALL accept it as a valid labeling method
4. WHEN form label issues are detected, THE Scanner SHALL include the input type and location in the evidence using plain language
5. WHEN suggesting fixes, THE Scanner SHALL provide simple examples of how to add labels without technical terminology

### Requirement 6: Content Quality Heuristics

**User Story:** As a site owner, I want the scanner to identify content quality issues, so that I can improve readability and user experience.

#### Acceptance Criteria

1. WHEN the Scanner detects paragraphs exceeding 300 words without breaks, THE Scanner SHALL create a "wall-of-text" issue with severity "low" and explain why shorter paragraphs help readers
2. WHEN the Scanner detects vague headings (e.g., "Introduction", "Overview" without context), THE Scanner SHALL create an issue with severity "low" and explain the benefit of descriptive headings
3. WHEN content quality issues are detected, THE Scanner SHALL include the text snippet and location in the evidence using everyday language
4. WHEN suggesting fixes, THE Scanner SHALL provide specific, actionable guidance that non-technical users can understand
5. WHEN analyzing content quality, THE Scanner SHALL focus on user-facing content and exclude navigation or footer text

### Requirement 7: Report Generation

**User Story:** As a site owner, I want to receive a clear report for each scanned URL, so that I can understand all detected issues and know what to fix first.

#### Acceptance Criteria

1. WHEN a scan completes, THE Scanner SHALL generate a report containing an overall score from 0 to 100 with a plain-language explanation
2. WHEN generating scores, THE Scanner SHALL calculate category subscores for accessibility, content quality, and structure with simple labels
3. WHEN creating the report, THE Scanner SHALL include each issue with: id, title, severity, confidence, plain-language explanation, evidence, and step-by-step fix instructions
4. WHEN the report is generated, THE Scanner SHALL include scan metadata: timestamp, URL, and detected website platform in user-friendly format
5. WHEN storing the report, THE Scanner SHALL save it as JSON in S3 with a deterministic key based on URL and timestamp

### Requirement 8: CMS Detection

**User Story:** As a content editor, I want the scanner to detect my CMS platform, so that I can receive platform-specific remediation guidance.

#### Acceptance Criteria

1. WHEN scanning a webpage, THE Scanner SHALL analyze meta tags, generator tags, and DOM patterns to detect the CMS
2. WHEN a CMS is detected, THE Scanner SHALL assign a confidence level (high, medium, low) based on the strength of indicators
3. WHEN WordPress is detected, THE Scanner SHALL identify whether it uses Gutenberg or Classic Editor when possible
4. WHEN the CMS cannot be determined, THE Scanner SHALL set the CMS field to "unknown" with confidence "none"
5. WHEN CMS detection completes, THE Scanner SHALL include the detected CMS and confidence in the report metadata

### Requirement 9: Scoring Model

**User Story:** As a site owner, I want consistent and understandable scores, so that I can track improvements over time and compare pages.

#### Acceptance Criteria

1. WHEN calculating the overall score, THE Scanner SHALL start at 100 and apply weighted deductions for each issue
2. WHEN applying deductions, THE Scanner SHALL weight critical issues higher than high, moderate, or low severity issues
3. WHEN the same page is scanned multiple times without changes, THE Scanner SHALL produce scores within 5 points of each other
4. WHEN calculating category subscores, THE Scanner SHALL group issues by category and apply the same deduction logic
5. WHEN all checks pass, THE Scanner SHALL assign a score of 100

### Requirement 10: Dashboard - Scan History

**User Story:** As a site owner, I want to view my scan history, so that I can track which URLs I've analyzed and when.

#### Acceptance Criteria

1. WHEN a user visits the dashboard, THE Dashboard SHALL display a list of all scans ordered by most recent first
2. WHEN displaying scan history, THE Dashboard SHALL show: URL, overall score, date/time, and detected website platform for each scan in simple terms
3. WHEN a user clicks on a scan entry, THE Dashboard SHALL navigate to the detailed report view for that scan
4. WHEN the scan history is empty, THE Dashboard SHALL display a friendly message prompting the user to scan their first URL
5. WHEN scan history loads, THE Dashboard SHALL retrieve scan metadata from DynamoDB

### Requirement 11: Dashboard - Report Detail View

**User Story:** As a site owner, I want to view detailed scan results with easy access to FixBot, so that I can understand specific issues and get help fixing them.

#### Acceptance Criteria

1. WHEN a user views a report, THE Dashboard SHALL display the overall score and category subscores with clear visual indicators (colors, icons) and a prominent "Chat with FixBot" button
2. WHEN displaying issues, THE Dashboard SHALL allow filtering by severity level (critical, high, moderate, low) with plain-language labels
3. WHEN displaying issues, THE Dashboard SHALL allow filtering by category (accessibility, content quality, structure) with simple descriptions
4. WHEN a user selects an issue, THE Dashboard SHALL display the full evidence including where the problem is and what content is affected in everyday language
5. WHEN displaying an issue, THE Dashboard SHALL show step-by-step fix instructions and provide a quick way to ask FixBot for more help

### Requirement 12: Dashboard - Recurring Issues View

**User Story:** As a site owner, I want to see recurring issues across multiple scanned URLs, so that I can identify systemic problems.

#### Acceptance Criteria

1. WHEN a user views the recurring issues page, THE Dashboard SHALL aggregate issues by title across all scanned URLs
2. WHEN displaying recurring issues, THE Dashboard SHALL show the count of affected URLs for each issue type
3. WHEN displaying recurring issues, THE Dashboard SHALL sort by frequency (most common first)
4. WHEN a user clicks on a recurring issue, THE Dashboard SHALL show which URLs are affected
5. WHEN fewer than 2 URLs have been scanned, THE Dashboard SHALL display a message indicating insufficient data

### Requirement 13: FixBot Chat - Contextual Assistance (PREMIER FEATURE)

**User Story:** As a site owner, I want to chat with FixBot about issues on my scanned page, so that I can get engaging, easy-to-follow guidance that makes fixing accessibility issues feel approachable and even fun.

#### Acceptance Criteria

1. WHEN a user opens FixBot from a report detail view, THE FixBot SHALL load the report and evidence as context and greet the user in a friendly, encouraging tone
2. WHEN a user asks about an issue, THE FixBot SHALL break down the problem in conversational language, cite the specific issue and evidence, and explain why it matters in relatable terms
3. WHEN a user asks a question unrelated to the scanned page, THE FixBot SHALL politely but firmly redirect to scan-related topics and refuse to discuss content not in the report
4. WHEN providing fix instructions, THE FixBot SHALL tailor steps to the detected website platform when confidence is medium or higher, using simple language and an encouraging tone
5. WHEN the FixBot cannot find relevant evidence in the report, THE FixBot SHALL explain it can only discuss issues found in the scan and suggest what the user can ask about instead

### Requirement 14: FixBot Chat - CMS-Specific Guidance (PREMIER FEATURE)

**User Story:** As a WordPress user, I want FixBot to provide WordPress-specific instructions in a friendly way, so that I can fix issues using the tools I'm familiar with without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN the detected CMS is WordPress with high confidence, THE FixBot SHALL provide Gutenberg block editor instructions with clear navigation steps and an encouraging, conversational tone
2. WHEN the detected CMS is Drupal with medium or high confidence, THE FixBot SHALL provide Drupal content editing instructions in beginner-friendly language with a supportive tone
3. WHEN the detected CMS is Umbraco with medium or high confidence, THE FixBot SHALL provide Umbraco editor instructions with simple step-by-step guidance and positive reinforcement
4. WHEN the CMS is unknown or confidence is low, THE FixBot SHALL provide general guidance that works across different website platforms while maintaining an encouraging tone
5. WHEN providing platform-specific steps, THE FixBot SHALL include clear navigation paths (e.g., "Click Pages, then Edit, then find the Block Settings button") and celebrate small wins

### Requirement 15: FixBot Chat - Evidence Grounding (PREMIER FEATURE)

**User Story:** As a site owner, I want FixBot to only discuss actual issues from my scan, so that I receive accurate and trustworthy guidance without any made-up information.

#### Acceptance Criteria

1. WHEN generating a response, THE FixBot SHALL only reference issues present in the loaded report and SHALL NOT discuss or speculate about content not in the report
2. WHEN citing evidence, THE FixBot SHALL include the exact location and content from the report in plain language and conversational tone
3. WHEN a user asks about page content not in the report, THE FixBot SHALL firmly but politely refuse, explain it can only discuss what was found in the scan, and suggest relevant topics the user can ask about
4. WHEN multiple issues are relevant, THE FixBot SHALL cite all applicable issues in the response and help the user prioritize which to tackle first
5. WHEN the FixBot provides a fix suggestion, THE FixBot SHALL base it strictly on the suggested fix field in the report, explain it in simple terms, and add encouraging context to make the task feel achievable

### Requirement 16: FixBot Chat - Engaging Personality (PREMIER FEATURE)

**User Story:** As a site owner who finds accessibility compliance boring, I want FixBot to be friendly and encouraging, so that fixing issues feels less like a chore and more like an achievable goal.

#### Acceptance Criteria

1. WHEN FixBot responds to any user message, THE FixBot SHALL use a warm, conversational tone that makes accessibility feel approachable rather than intimidating
2. WHEN explaining technical concepts, THE FixBot SHALL use analogies, examples, and relatable language that demystifies accessibility
3. WHEN a user completes a fix or makes progress, THE FixBot SHALL celebrate their achievement with positive reinforcement
4. WHEN a user feels overwhelmed by multiple issues, THE FixBot SHALL break down the work into manageable steps and provide encouragement
5. WHEN maintaining an engaging personality, THE FixBot SHALL still remain professional, accurate, and strictly grounded to the scanned report

### Requirement 17: AWS Infrastructure - Storage

**User Story:** As a system administrator, I want scan reports stored reliably in AWS, so that they are durable and retrievable.

#### Acceptance Criteria

1. WHEN a report is generated, THE System SHALL store the complete JSON report in an S3 bucket
2. WHEN storing in S3, THE System SHALL use a key format: `reports/{url_hash}/{timestamp}.json`
3. WHEN a report is stored, THE System SHALL record metadata in DynamoDB including: scan_id, url, timestamp, score, and S3 key
4. WHEN retrieving a report, THE System SHALL fetch it from S3 using the key stored in DynamoDB
5. WHEN S3 storage fails, THE System SHALL retry up to 3 times before marking the scan as failed

### Requirement 18: AWS Infrastructure - Scanning Jobs

**User Story:** As a system administrator, I want scanning to run as serverless jobs, so that the system scales efficiently.

#### Acceptance Criteria

1. WHEN a scan is requested, THE System SHALL invoke a Lambda function or container to execute the scan
2. WHEN processing a batch scan, THE System SHALL process URLs in parallel up to a concurrency limit of 5
3. WHEN a scan job exceeds 5 minutes, THE System SHALL timeout and record a failure
4. WHEN a scan completes, THE System SHALL publish the result to an event bus or queue for downstream processing
5. WHEN Lambda memory is insufficient for headless browser, THE System SHALL use a container-based solution (ECS/Fargate)

### Requirement 19: AWS Infrastructure - API Gateway

**User Story:** As a dashboard developer, I want RESTful APIs for scan operations and chat, so that I can build the frontend interface.

#### Acceptance Criteria

1. WHEN the dashboard requests scan history, THE API SHALL return paginated results from DynamoDB
2. WHEN the dashboard submits a scan request, THE API SHALL validate the URL(s) and invoke the scanning job
3. WHEN the dashboard requests a specific report, THE API SHALL retrieve it from S3 and return the JSON
4. WHEN the dashboard sends a chat message, THE API SHALL invoke Bedrock with the report context and return the response
5. WHEN API requests fail, THE API SHALL return appropriate HTTP status codes and error messages

### Requirement 20: AWS Infrastructure - AI Integration

**User Story:** As a system administrator, I want to use AWS Bedrock for AI capabilities, so that I can leverage managed LLM services.

#### Acceptance Criteria

1. WHEN analyzing alt text quality, THE System SHALL invoke Bedrock (Claude or Titan) with the alt text and image context
2. WHEN generating FixBot responses, THE System SHALL invoke Bedrock with the report as RAG context and the user question
3. WHEN calling Bedrock, THE System SHALL include system prompts that enforce evidence grounding and refusal rules
4. WHEN Bedrock responses are received, THE System SHALL validate they contain required citations before returning to the user
5. WHEN Bedrock API calls fail, THE System SHALL retry with exponential backoff up to 3 attempts

### Requirement 21: Local Development Support

**User Story:** As a developer, I want to run the system locally, so that I can develop and test without AWS dependencies.

#### Acceptance Criteria

1. WHEN running locally, THE System SHALL support LocalStack or similar tools for S3 and DynamoDB emulation
2. WHEN running locally, THE System SHALL allow configuration of local Bedrock alternatives or mock responses
3. WHEN local configuration is detected, THE System SHALL use local endpoints instead of AWS service endpoints
4. WHEN running locally, THE System SHALL provide seed data with 3-5 known URLs for testing
5. WHEN switching between local and AWS modes, THE System SHALL use environment variables for configuration

### Requirement 22: Deterministic Scanning

**User Story:** As a site owner, I want consistent scan results, so that I can trust score changes reflect actual page changes.

#### Acceptance Criteria

1. WHEN scanning the same URL twice without page changes, THE Scanner SHALL detect the same issues
2. WHEN calculating scores, THE Scanner SHALL use deterministic algorithms without random variation
3. WHEN AI analysis is used, THE Scanner SHALL set temperature to 0 or use caching to ensure consistency
4. WHEN timestamps differ between scans, THE Scanner SHALL exclude timestamp fields when comparing reports for equivalence
5. WHEN page content changes, THE Scanner SHALL reflect those changes in the new report

### Requirement 23: Error Handling and Resilience

**User Story:** As a system administrator, I want graceful error handling, so that partial failures don't break the entire system.

#### Acceptance Criteria

1. WHEN a single URL in a batch fails, THE System SHALL continue processing remaining URLs
2. WHEN the headless browser crashes, THE System SHALL log the error and mark that scan as failed
3. WHEN AWS services are temporarily unavailable, THE System SHALL retry with exponential backoff
4. WHEN an error occurs, THE System SHALL record detailed error information in CloudWatch Logs
5. WHEN a scan fails, THE System SHALL store a failure record in DynamoDB with the error reason

### Requirement 24: Demo Dataset

**User Story:** As a developer, I want a repeatable demo dataset, so that I can demonstrate the system reliably.

#### Acceptance Criteria

1. WHEN initializing the demo environment, THE System SHALL provide 3-5 pre-configured URLs with known issues
2. WHEN demo URLs are scanned, THE System SHALL produce consistent reports suitable for demonstration
3. WHEN running demos, THE System SHALL include at least one URL for each supported CMS type
4. WHEN demo data is loaded, THE System SHALL populate scan history with realistic timestamps
5. WHEN resetting the demo, THE System SHALL clear all scan data and restore the initial demo URLs

### Requirement 25: Stretch - Contrast Detection

**User Story:** As an accessibility auditor, I want the scanner to detect potential contrast issues, so that I can ensure text is readable.

#### Acceptance Criteria

1. WHEN the Scanner analyzes a page, THE Scanner SHALL extract computed foreground and background colors for text elements
2. WHEN color values are extracted, THE Scanner SHALL calculate the contrast ratio using WCAG formulas
3. WHEN the contrast ratio is below 4.5:1 for normal text, THE Scanner SHALL create an issue with severity "high"
4. WHEN the contrast ratio is below 3:1 for large text, THE Scanner SHALL create an issue with severity "high"
5. WHEN contrast issues are detected, THE Scanner SHALL include the color values and calculated ratio in the evidence

### Requirement 26: Stretch - ARIA Misuse Detection

**User Story:** As a site owner, I want the scanner to detect when accessibility features are used incorrectly, so that I can avoid making my site harder to use.

#### Acceptance Criteria

1. WHEN the Scanner detects aria-label on non-interactive elements, THE Scanner SHALL create an issue with severity "moderate" and explain the problem in simple terms
2. WHEN the Scanner detects conflicting ARIA roles, THE Scanner SHALL create an issue with severity "high" and explain why this confuses assistive technology
3. WHEN the Scanner detects aria-hidden on focusable elements, THE Scanner SHALL create an issue with severity "critical" and explain the impact on keyboard users
4. WHEN ARIA misuse is detected, THE Scanner SHALL explain why the pattern is problematic using everyday language
5. WHEN suggesting fixes, THE Scanner SHALL recommend simpler alternatives that don't require technical knowledge

### Requirement 27: Stretch - Readability Metrics

**User Story:** As a site owner, I want readability scores for my content, so that I can ensure it's easy to understand for my audience.

#### Acceptance Criteria

1. WHEN the Scanner analyzes page content, THE Scanner SHALL calculate a Flesch Reading Ease score and explain what it means in simple terms
2. WHEN the readability score is below 30 (very difficult), THE Scanner SHALL create an issue with severity "low" and explain why simpler language helps
3. WHEN displaying readability issues, THE Scanner SHALL include the score and grade level in plain language (e.g., "college level" instead of technical terms)
4. WHEN suggesting fixes, THE Scanner SHALL recommend specific, easy-to-understand techniques like using shorter sentences or simpler words
5. WHEN calculating readability, THE Scanner SHALL analyze only main content and exclude navigation, headers, and footers
