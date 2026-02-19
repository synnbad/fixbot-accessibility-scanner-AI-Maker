// Core data types for FixBot MVP

export interface Issue {
  id: string;
  title: string;
  category: 'accessibility' | 'content-quality' | 'structure';
  severity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
  whyItMatters: string;
  evidence: Evidence;
  suggestedFix: string;
}

export interface Evidence {
  selector: string;
  snippet: string;
  location: string;
}

export interface CMSInfo {
  platform: 'wordpress' | 'drupal' | 'umbraco' | 'unknown';
  confidence: 'high' | 'medium' | 'low' | 'none';
}

export interface ScoreBreakdown {
  overall: number;
  categories: {
    accessibility: number;
    contentQuality: number;
    structure: number;
  };
}

export interface Report {
  scanId: string;
  url: string;
  timestamp: string;
  scores: ScoreBreakdown;
  cms: CMSInfo;
  issues: Issue[];
}

export interface ScanRequest {
  url: string;
}

export interface ChatRequest {
  scanId: string;
  message: string;
  userProfile?: UserProfile;
}

export interface ChatResponse {
  response: string;
  citations: string[];
  needsProfileSetup?: boolean;
}

export interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  role: 'content-editor' | 'developer' | 'designer' | 'site-owner' | 'other';
  preferredDetail: 'step-by-step' | 'summary' | 'technical';
}
