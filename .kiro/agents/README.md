# FixBot Team AI Agents

Specialized AI agent configurations for each team member's role in the hackathon.

## How to Use

Each team member can invoke their specialized agent in Kiro to get context-aware assistance:

```
@agent-name <your question or task>
```

Or use the agent selector in Kiro's UI.

## Available Agents

### 1. Sinbad - Infrastructure & Scanner Core
**File:** `sinbad-infrastructure.json`

**Expertise:**
- AWS CDK/Terraform infrastructure
- S3 and DynamoDB setup
- Lambda/ECS containers
- Puppeteer/Playwright
- API Gateway
- Error handling and monitoring

**Use for:**
- Setting up AWS resources
- Implementing scanner core
- CMS detection logic
- Scoring model
- Batch processing
- Performance optimization

**Example prompts:**
- "Help me set up the S3 bucket structure for reports"
- "Implement CMS detection for WordPress"
- "Create the scoring model with weighted deductions"
- "Add retry logic for failed scans"

---

### 2. Edrina - Issue Analyzers
**File:** `edrina-analyzers.json`

**Expertise:**
- WCAG 2.1 compliance
- DOM analysis and traversal
- Accessibility issue detection
- Evidence extraction
- Plain-language descriptions

**Use for:**
- Implementing analyzers
- Writing issue descriptions
- Severity classification
- Evidence extraction
- Testing with real websites

**Example prompts:**
- "Implement the alt text analyzer"
- "Create a heading structure analyzer that detects skipped levels"
- "Write a plain-language description for this WCAG violation"
- "Add evidence extraction for form label issues"

---

### 3. Hrithik - FixBot Chat Backend
**File:** `hrithik-fixbot.json`

**Expertise:**
- AWS Bedrock integration
- RAG implementation
- Prompt engineering
- Grounding techniques
- CMS-specific guidance

**Use for:**
- Bedrock API integration
- System prompt design
- Response validation
- Citation extraction
- Conversation management

**Example prompts:**
- "Integrate AWS Bedrock Claude 3 for chat"
- "Create a system prompt that enforces grounding"
- "Implement response validation to check for citations"
- "Add WordPress-specific guidance templates"
- "Test grounding with off-topic questions"

---

### 4. Caleb - Dashboard Frontend
**File:** `caleb-frontend.json`

**Expertise:**
- React/Vue.js
- Data visualization
- REST API integration
- Responsive design
- UX/UI best practices

**Use for:**
- Building UI components
- Report visualization
- Chat interface
- API integration
- Styling and animations

**Example prompts:**
- "Create a report detail view component"
- "Implement the chat interface with message history"
- "Add issue filtering by severity and category"
- "Design a score visualization with circular progress"
- "Make the UI responsive for mobile"

---

### 5. Pooja - Testing, Integration & Demo
**File:** `pooja-testing.json`

**Expertise:**
- Integration testing
- Unit testing
- Demo preparation
- Bug triage
- Quality assurance

**Use for:**
- Writing tests
- Demo script creation
- Bug documentation
- Integration validation
- Demo dataset preparation

**Example prompts:**
- "Write integration tests for the scan flow"
- "Create a demo script for the 5-minute presentation"
- "Prepare a demo dataset with 5 URLs"
- "Test FixBot grounding with edge cases"
- "Create a backup plan if the demo fails"

---

## Agent Features

Each agent has:
- ✅ **Specialized knowledge** for their domain
- ✅ **Context awareness** of the project spec
- ✅ **Code style guidelines** for consistency
- ✅ **Hackathon priorities** for time management
- ✅ **Best practices** for their role

## Tips for Effective Use

1. **Be specific**: "Implement alt text analyzer" vs "help with accessibility"
2. **Reference the spec**: Agents have full context of requirements and design
3. **Ask for examples**: "Show me how to..." gets code samples
4. **Iterate**: Start with basic implementation, then refine
5. **Cross-reference**: Agents know about each other's work

## Collaboration Between Agents

Agents are aware of dependencies:
- **Sinbad** provides infrastructure for **Edrina's** analyzers
- **Edrina's** analyzers feed **Hrithik's** FixBot responses
- **Hrithik's** API is consumed by **Caleb's** frontend
- **Pooja** tests everyone's work and prepares the demo

## Quick Start

1. Open Kiro
2. Select your agent from the agent menu
3. Ask questions or request implementations
4. Review and refine the output
5. Commit your changes

## During the Hackathon

**Day 1:** Focus on your core responsibilities
**Day 2:** Integrate with other team members' work
**Day 3:** Polish, test, and prepare demo

Each agent knows the 3-day timeline and will prioritize accordingly!

---

**Pro Tip:** You can switch between agents as needed. For example, Sinbad might use Edrina's agent to understand analyzer requirements, or Caleb might use Hrithik's agent to understand the chat API.

Good luck at the hackathon! 🚀
