# Integrating AWS Bedrock for Production FixBot

## Current State (MVP)

The MVP uses `src/fixbot.ts` with simple keyword matching. This is fine for demo but not production-ready.

## Production Implementation

Use `src/fixbot-bedrock.ts` which provides:
- Real AI responses via AWS Bedrock
- Strict grounding enforcement via system prompts
- Citation extraction
- CMS-aware guidance
- Conversational personality

## Setup Steps

### 1. Install AWS SDK

```bash
npm install @aws-sdk/client-bedrock-runtime
```

### 2. Configure AWS Credentials

```bash
# Set environment variables
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret

# Or use AWS CLI
aws configure
```

### 3. Enable Bedrock Model Access

1. Go to AWS Console → Bedrock → Model access
2. Request access to:
   - **Claude 3 Sonnet** (recommended - best quality)
   - **Claude 3 Haiku** (faster, cheaper alternative)
   - **Titan Text Express** (cheapest option)

### 4. Update src/index.ts

Replace the import:

```typescript
// OLD (MVP mock)
import { generateFixBotResponse } from './fixbot';

// NEW (Production with Bedrock)
import { generateFixBotResponseWithBedrock } from './fixbot-bedrock';
```

Update the chat endpoint:

```typescript
app.post('/api/chat', async (req, res) => {
  try {
    const { scanId, message, conversationHistory } = req.body;

    if (!scanId || !message) {
      return res.status(400).json({ error: 'scanId and message are required' });
    }

    const report = getReport(scanId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Use Bedrock instead of mock
    const response = await generateFixBotResponseWithBedrock(
      report, 
      message,
      conversationHistory || []
    );
    
    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Update Frontend to Send Conversation History

In `public/index.html`, modify the `sendMessage()` function:

```javascript
let conversationHistory = [];

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message || !currentScanId) return;

  const chatMessages = document.getElementById('chatMessages');
  
  // Add user message
  chatMessages.innerHTML += `<div class="message user">${message}</div>`;
  conversationHistory.push({ role: 'user', content: message });
  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        scanId: currentScanId, 
        message,
        conversationHistory // Send history for context
      })
    });

    const data = await response.json();
    chatMessages.innerHTML += `<div class="message bot">${data.response}</div>`;
    conversationHistory.push({ role: 'assistant', content: data.response });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (err) {
    chatMessages.innerHTML += `<div class="message bot">Sorry, I encountered an error. Please try again.</div>`;
  }
}
```

## Model Comparison

| Model | Speed | Cost | Quality | Best For |
|-------|-------|------|---------|----------|
| **Claude 3 Sonnet** | Medium | $$$ | Excellent | Production, best UX |
| **Claude 3 Haiku** | Fast | $$ | Good | High volume, cost-conscious |
| **Titan Text Express** | Fast | $ | Basic | MVP, budget constraints |

## Cost Estimates (Hackathon)

Assuming 100 chat interactions during demo:
- **Claude 3 Sonnet**: ~$0.50
- **Claude 3 Haiku**: ~$0.10
- **Titan Text Express**: ~$0.05

All models are essentially free for hackathon usage!

## Testing Grounding

Once integrated, test these scenarios:

1. **Valid questions** (should answer with citations):
   - "What image issues did you find?"
   - "How do I fix the heading problems?"
   - "Give me an overview of all issues"

2. **Out-of-scope questions** (should refuse):
   - "What's the weather like?"
   - "Tell me about colors on the page" (if not in report)
   - "How do I add a contact form?"

3. **Edge cases**:
   - Empty report (no issues found)
   - Multiple similar issues
   - CMS-specific guidance requests

## Fallback Strategy

If Bedrock fails during hackathon:
1. Keep the mock `fixbot.ts` as backup
2. Add environment variable to switch: `USE_BEDROCK=true/false`
3. Gracefully degrade to keyword matching

```typescript
const useBedrock = process.env.USE_BEDROCK === 'true';

const response = useBedrock 
  ? await generateFixBotResponseWithBedrock(report, message)
  : generateFixBotResponse(report, message);
```

## Next Steps for Hackathon

1. **Day 1 Evening**: Get Bedrock access approved
2. **Day 2 Morning**: Integrate and test with real scans
3. **Day 2 Afternoon**: Refine system prompts based on responses
4. **Day 3**: Polish personality and edge cases

The mock version works for initial testing, but Bedrock integration is what makes FixBot truly impressive! 🚀
