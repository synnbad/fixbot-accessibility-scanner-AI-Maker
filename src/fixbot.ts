import { Report, ChatRequest, ChatResponse } from './types';

export function generateFixBotResponse(report: Report, userMessage: string): ChatResponse {
  const message = userMessage.toLowerCase();
  const citations: string[] = [];

  // Simple keyword-based response (mock AI for MVP)
  // In production, this would call AWS Bedrock

  // Check if asking about images/alt text
  if (message.includes('image') || message.includes('alt') || message.includes('picture')) {
    const imageIssues = report.issues.filter((i) => i.title.includes('alt text'));
    
    if (imageIssues.length > 0) {
      const issue = imageIssues[0];
      citations.push(issue.id);
      
      let response = `I found ${imageIssues.length} image issue${imageIssues.length > 1 ? 's' : ''} on your page! 📸\n\n`;
      response += `**Issue:** ${issue.title}\n`;
      response += `**Why it matters:** ${issue.whyItMatters}\n\n`;
      response += `**How to fix it:**\n${issue.suggestedFix}\n\n`;
      
      if (report.cms.platform === 'wordpress' && report.cms.confidence !== 'none') {
        response += `**WordPress tip:** Click on the image in your editor, then look for the "Alt text" field in the right sidebar under "Image settings". Type a description of what the image shows, then click "Update"! 🎯`;
      }
      
      return { response, citations };
    }
  }

  // Check if asking about headings
  if (message.includes('heading') || message.includes('h1') || message.includes('h2') || message.includes('structure')) {
    const headingIssues = report.issues.filter((i) => i.category === 'structure');
    
    if (headingIssues.length > 0) {
      const issue = headingIssues[0];
      citations.push(issue.id);
      
      let response = `Let's talk about your page structure! 📋\n\n`;
      response += `**Issue:** ${issue.title}\n`;
      response += `**Why it matters:** ${issue.whyItMatters}\n\n`;
      response += `**How to fix it:**\n${issue.suggestedFix}\n\n`;
      
      if (report.cms.platform === 'wordpress' && report.cms.confidence !== 'none') {
        response += `**WordPress tip:** Click on the heading you want to change. In the toolbar, you'll see a dropdown showing the heading level (H1, H2, etc.). Click it and select the correct level. Easy! ✨`;
      }
      
      return { response, citations };
    }
  }

  // General overview
  if (message.includes('overview') || message.includes('summary') || message.includes('what') || message.includes('issues')) {
    const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
    const highCount = report.issues.filter((i) => i.severity === 'high').length;
    
    let response = `Great question! Here's what I found on your page:\n\n`;
    response += `**Overall Score:** ${report.scores.overall}/100\n`;
    response += `**Total Issues:** ${report.issues.length}\n`;
    if (criticalCount > 0) response += `- ${criticalCount} critical issue${criticalCount > 1 ? 's' : ''}\n`;
    if (highCount > 0) response += `- ${highCount} high priority issue${highCount > 1 ? 's' : ''}\n`;
    response += `\n**Top issues to fix:**\n`;
    
    report.issues.slice(0, 3).forEach((issue, i) => {
      response += `${i + 1}. ${issue.title}\n`;
      citations.push(issue.id);
    });
    
    response += `\nAsk me about any specific issue and I'll walk you through fixing it! 💪`;
    
    return { response, citations };
  }

  // Out of scope - demonstrate grounding
  if (message.includes('color') || message.includes('font') || message.includes('layout') || 
      message.includes('weather') || message.includes('news')) {
    return {
      response: `I can only help with issues I found in your scan. I didn't detect any issues related to that on this page. Try asking me about:\n\n- Image alt text\n- Heading structure\n- Overall accessibility score\n\nWhat would you like to know? 🤔`,
      citations: [],
    };
  }

  // Default helpful response
  return {
    response: `I'm here to help you fix accessibility issues on your page! 🎯\n\nI found ${report.issues.length} issue${report.issues.length !== 1 ? 's' : ''} total. You can ask me about:\n\n- Image alt text problems\n- Heading structure issues\n- Overall score and priorities\n\nWhat would you like to tackle first?`,
    citations: [],
  };
}
