import { Report, ChatRequest, ChatResponse, UserProfile } from './types';

export function generateFixBotResponse(
  report: Report, 
  userMessage: string,
  userProfile?: UserProfile
): ChatResponse {
  const message = userMessage.toLowerCase();
  const citations: string[] = [];

  // Check if we need to set up user profile
  if (!userProfile && !message.includes('beginner') && !message.includes('intermediate') && !message.includes('advanced')) {
    // First interaction - ask about skill level
    if (message.includes('hello') || message.includes('hi') || message.includes('help') || message.includes('start')) {
      return {
        response: `Hi there! 👋 I'm FixBot, your accessibility assistant!\n\nBefore we dive in, I'd love to know a bit about you so I can tailor my guidance:\n\n**What's your experience level?**\n- 🌱 Beginner: "I'm new to web accessibility"\n- 🌿 Intermediate: "I know the basics"\n- 🌳 Advanced: "I'm experienced with WCAG"\n\nJust tell me which one fits you best!`,
        citations: [],
        needsProfileSetup: true
      };
    }
  }

  // Handle skill level selection
  if (message.includes('beginner') || message.includes('new') || message.includes('learning')) {
    return {
      response: `Perfect! I'll guide you step-by-step with clear explanations. 🌱\n\nI found ${report.issues.length} issue${report.issues.length !== 1 ? 's' : ''} on your page (Score: ${Math.round(report.scores.overall)}/100).\n\nDon't worry - I'll break everything down in plain English and show you exactly what to do. No technical jargon, I promise!\n\nWhat would you like to tackle first? You can ask me:\n- "What are the most important issues?"\n- "Tell me about the image problems"\n- "How do I fix the headings?"\n\nI'm here to help! 💪`,
      citations: []
    };
  }

  if (message.includes('intermediate') || message.includes('basics')) {
    return {
      response: `Great! I'll give you clear guidance with some technical context. 🌿\n\nHere's what I found:\n- **Score:** ${Math.round(report.scores.overall)}/100\n- **Issues:** ${report.issues.length} total\n- **Critical:** ${report.issues.filter(i => i.severity === 'critical').length}\n- **High:** ${report.issues.filter(i => i.severity === 'high').length}\n\nI'll explain the "why" behind each issue and give you practical fixes. Ask me about specific issues or request an overview!\n\nWhat would you like to explore?`,
      citations: []
    };
  }

  if (message.includes('advanced') || message.includes('experienced') || message.includes('wcag')) {
    return {
      response: `Excellent! I'll keep it technical and efficient. 🌳\n\n**Scan Results:**\n- Overall: ${Math.round(report.scores.overall)}/100\n- Accessibility: ${Math.round(report.scores.categories.accessibility)}/100\n- Structure: ${Math.round(report.scores.categories.structure)}/100\n- Content: ${Math.round(report.scores.categories.contentQuality)}/100\n\n**Issue Breakdown:**\n${report.issues.slice(0, 5).map((i, idx) => `${idx + 1}. ${i.title} [${i.severity}] - WCAG ${i.category}`).join('\n')}\n\nI'll provide WCAG references and technical details. What do you need?`,
      citations: report.issues.slice(0, 5).map(i => i.id)
    };
  }

  // Determine response style based on profile
  const isDetailed = !userProfile || userProfile.skillLevel === 'beginner';
  const isTechnical = userProfile?.skillLevel === 'advanced';

  // Check if asking about images/alt text
  if (message.includes('image') || message.includes('alt') || message.includes('picture')) {
    const imageIssues = report.issues.filter((i) => i.title.includes('alt text'));
    
    if (imageIssues.length > 0) {
      const issue = imageIssues[0];
      citations.push(issue.id);
      
      let response = '';
      
      if (isDetailed) {
        response = `I found ${imageIssues.length} image issue${imageIssues.length > 1 ? 's' : ''} on your page! 📸\n\n`;
        response += `**The Problem:** ${issue.description}\n`;
        response += `**Why it matters:** ${issue.whyItMatters}\n\n`;
        response += `**How to fix it (step-by-step):**\n${issue.suggestedFix}\n\n`;
        
        if (report.cms.platform === 'wordpress' && report.cms.confidence !== 'none') {
          response += `**WordPress Guide:**\n`;
          response += `1. Go to your page editor\n`;
          response += `2. Click on the image\n`;
          response += `3. Look for "Alt text" in the right sidebar\n`;
          response += `4. Type what the image shows (be descriptive!)\n`;
          response += `5. Click "Update" to save\n\n`;
          response += `💡 Tip: Describe what's in the image like you're telling a friend over the phone!`;
        }
      } else if (isTechnical) {
        response = `**Alt Text Issues:** ${imageIssues.length} detected\n\n`;
        response += `**Primary Issue:** ${issue.title}\n`;
        response += `**Selector:** \`${issue.evidence.selector}\`\n`;
        response += `**WCAG:** 1.1.1 Non-text Content (Level A)\n\n`;
        response += `**Fix:** Add descriptive alt attribute. ${issue.suggestedFix}\n\n`;
        if (report.cms.platform !== 'unknown') {
          response += `**CMS:** ${report.cms.platform} detected - use native image editor`;
        }
      } else {
        response = `Found ${imageIssues.length} image issue${imageIssues.length > 1 ? 's' : ''}! 📸\n\n`;
        response += `**Issue:** ${issue.title}\n`;
        response += `**Why fix it:** ${issue.whyItMatters}\n\n`;
        response += `**Quick fix:** ${issue.suggestedFix}\n\n`;
        if (report.cms.platform === 'wordpress' && report.cms.confidence !== 'none') {
          response += `**In WordPress:** Click image → Alt text field → Describe the image → Update`;
        }
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
      
      let response = '';
      
      if (isDetailed) {
        response = `Let's look at your page structure! 📋\n\n`;
        response += `**The Problem:** ${issue.description}\n`;
        response += `**Why it matters:** ${issue.whyItMatters}\n\n`;
        response += `Think of headings like a table of contents - they help everyone navigate your page!\n\n`;
        response += `**How to fix it:**\n${issue.suggestedFix}\n\n`;
        
        if (report.cms.platform === 'wordpress' && report.cms.confidence !== 'none') {
          response += `**WordPress Guide:**\n`;
          response += `1. Click on the heading you want to change\n`;
          response += `2. Look for the heading dropdown in the toolbar (shows H1, H2, etc.)\n`;
          response += `3. Select the correct level\n`;
          response += `4. Click "Update"\n\n`;
          response += `💡 Tip: Use H1 for your main title, H2 for sections, H3 for subsections!`;
        }
      } else if (isTechnical) {
        response = `**Structure Issues:** ${headingIssues.length} detected\n\n`;
        response += `**Primary:** ${issue.title}\n`;
        response += `**Location:** ${issue.evidence.location}\n`;
        response += `**WCAG:** 1.3.1 Info and Relationships (Level A)\n\n`;
        response += `**Fix:** ${issue.suggestedFix}`;
      } else {
        response = `Found ${headingIssues.length} heading issue${headingIssues.length > 1 ? 's' : ''}! 📋\n\n`;
        response += `**Issue:** ${issue.title}\n`;
        response += `**Impact:** ${issue.whyItMatters}\n\n`;
        response += `**Fix:** ${issue.suggestedFix}`;
      }
      
      return { response, citations };
    }
  }

  // General overview
  if (message.includes('overview') || message.includes('summary') || message.includes('what') || message.includes('issues') || message.includes('important')) {
    const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
    const highCount = report.issues.filter((i) => i.severity === 'high').length;
    
    let response = '';
    
    if (isDetailed) {
      response = `Great question! Here's what I found on your page:\n\n`;
      response += `**Overall Score:** ${Math.round(report.scores.overall)}/100 `;
      response += report.scores.overall >= 80 ? '🎉 Pretty good!' : report.scores.overall >= 60 ? '👍 Room for improvement' : '⚠️ Needs attention';
      response += `\n\n**Total Issues:** ${report.issues.length}\n`;
      if (criticalCount > 0) response += `- ⚠️ ${criticalCount} critical (fix these first!)\n`;
      if (highCount > 0) response += `- 🔴 ${highCount} high priority\n`;
      response += `\n**Top issues to tackle:**\n`;
      
      report.issues.slice(0, 3).forEach((issue, i) => {
        response += `${i + 1}. ${issue.title} - ${issue.whyItMatters.substring(0, 60)}...\n`;
        citations.push(issue.id);
      });
      
      response += `\nAsk me about any specific issue and I'll walk you through fixing it step-by-step! 💪`;
    } else if (isTechnical) {
      response = `**Accessibility Audit Results**\n\n`;
      response += `**Scores:**\n`;
      response += `- Overall: ${Math.round(report.scores.overall)}/100\n`;
      response += `- Accessibility: ${Math.round(report.scores.categories.accessibility)}/100\n`;
      response += `- Structure: ${Math.round(report.scores.categories.structure)}/100\n`;
      response += `- Content: ${Math.round(report.scores.categories.contentQuality)}/100\n\n`;
      response += `**Issues by Severity:**\n`;
      response += `- Critical: ${criticalCount}\n`;
      response += `- High: ${highCount}\n`;
      response += `- Moderate: ${report.issues.filter(i => i.severity === 'moderate').length}\n`;
      response += `- Low: ${report.issues.filter(i => i.severity === 'low').length}\n\n`;
      response += `**Priority Fixes:**\n`;
      report.issues.slice(0, 3).forEach((issue, i) => {
        response += `${i + 1}. ${issue.title} [${issue.severity}]\n`;
        citations.push(issue.id);
      });
    } else {
      response = `Here's your accessibility snapshot! 📊\n\n`;
      response += `**Score:** ${Math.round(report.scores.overall)}/100\n`;
      response += `**Issues:** ${report.issues.length} total\n`;
      if (criticalCount > 0) response += `- ${criticalCount} critical\n`;
      if (highCount > 0) response += `- ${highCount} high priority\n`;
      response += `\n**Top priorities:**\n`;
      
      report.issues.slice(0, 3).forEach((issue, i) => {
        response += `${i + 1}. ${issue.title}\n`;
        citations.push(issue.id);
      });
      
      response += `\nAsk about any issue for details!`;
    }
    
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
  const defaultResponse = isDetailed
    ? `I'm here to help you fix accessibility issues on your page! 🎯\n\nI found ${report.issues.length} issue${report.issues.length !== 1 ? 's' : ''} total. You can ask me about:\n\n- "What are the most important issues?"\n- "Tell me about image problems"\n- "How do I fix headings?"\n- "Give me an overview"\n\nWhat would you like to tackle first?`
    : `I found ${report.issues.length} issue${report.issues.length !== 1 ? 's' : ''} on your page. Ask me about:\n\n- Image alt text\n- Heading structure  \n- Overall score\n\nWhat do you need?`;

  return {
    response: defaultResponse,
    citations: [],
  };
}
