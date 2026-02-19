import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Report, ChatRequest, ChatResponse } from './types';

// AWS Bedrock integration for production FixBot
// This replaces the mock keyword-based responses in fixbot.ts

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

export async function generateFixBotResponseWithBedrock(
  report: Report, 
  userMessage: string,
  conversationHistory: Array<{role: string, content: string}> = []
): Promise<ChatResponse> {
  
  // Build the system prompt with grounding rules
  const systemPrompt = buildSystemPrompt(report);
  
  // Build the conversation with context
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    // Call Claude via Bedrock
    const response = await invokeClaudeModel(systemPrompt, messages);
    
    // Extract citations from the response
    const citations = extractCitations(response, report);
    
    return {
      response,
      citations
    };
  } catch (error) {
    console.error('Bedrock error:', error);
    throw new Error('Failed to generate response');
  }
}

function buildSystemPrompt(report: Report): string {
  return `You are FixBot, a friendly accessibility assistant helping users fix issues on their website.

STRICT GROUNDING RULES:
1. You can ONLY discuss issues found in the provided scan report below
2. You MUST cite specific issue IDs when answering (format: [Issue: <id>])
3. You MUST refuse questions about content not in the report
4. You MUST NOT speculate or make up information
5. If asked about something not in the report, politely redirect to what you CAN help with

PERSONALITY GUIDELINES:
- Be warm, conversational, and encouraging
- Make accessibility feel approachable, not intimidating
- Celebrate user progress and small wins
- Break down complex issues into simple, actionable steps
- Use analogies and relatable examples
- Avoid technical jargon - explain in plain English

CMS-SPECIFIC GUIDANCE:
- Detected CMS: ${report.cms.platform}
- Confidence: ${report.cms.confidence}
- When confidence is medium or higher, provide platform-specific instructions
- Include clear navigation paths (e.g., "Click Pages → Edit → Block Settings")

SCAN REPORT CONTEXT:
URL: ${report.url}
Overall Score: ${report.scores.overall}/100
Total Issues: ${report.issues.length}

ISSUES FOUND:
${report.issues.map((issue, i) => `
Issue ${i + 1} [ID: ${issue.id}]:
- Title: ${issue.title}
- Severity: ${issue.severity}
- Category: ${issue.category}
- Description: ${issue.description}
- Why it matters: ${issue.whyItMatters}
- Evidence: ${issue.evidence.snippet} (Location: ${issue.evidence.location})
- Suggested fix: ${issue.suggestedFix}
${issue.cmsSpecificFix ? `- CMS-specific fix: ${JSON.stringify(issue.cmsSpecificFix)}` : ''}
`).join('\n')}

Remember: You can ONLY discuss the issues listed above. If the user asks about anything else, politely explain you can only help with issues found in this scan.`;
}

async function invokeClaudeModel(
  systemPrompt: string, 
  messages: Array<{role: string, content: string}>
): Promise<string> {
  
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1000,
    temperature: 0.7, // Slightly creative but consistent
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0', // or claude-3-haiku for faster/cheaper
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  return responseBody.content[0].text;
}

function extractCitations(response: string, report: Report): string[] {
  const citations: string[] = [];
  
  // Look for issue ID references in the response
  report.issues.forEach(issue => {
    if (response.includes(issue.id) || 
        response.toLowerCase().includes(issue.title.toLowerCase())) {
      citations.push(issue.id);
    }
  });
  
  return [...new Set(citations)]; // Remove duplicates
}

// Alternative: Use Titan model (cheaper, faster, but less capable)
export async function generateFixBotResponseWithTitan(
  report: Report, 
  userMessage: string
): Promise<ChatResponse> {
  
  const prompt = `${buildSystemPrompt(report)}

User Question: ${userMessage}

Assistant Response:`;

  const payload = {
    inputText: prompt,
    textGenerationConfig: {
      maxTokenCount: 1000,
      temperature: 0.5,
      topP: 0.9
    }
  };

  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-text-express-v1',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  const text = responseBody.results[0].outputText;
  const citations = extractCitations(text, report);
  
  return { response: text, citations };
}
