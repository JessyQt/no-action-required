export type Severity = "high" | "medium" | "low";
export type Impact = "minor" | "moderate" | "serious" | "critical";

export interface ApiNodeDetails {
  tag: string;
  location: string;
  text_content: string;
  attributes: string;
}

export interface ApiAffectedNode {
  html: string;
  node_details: ApiNodeDetails;
}

export interface ApiViolation {
  description: string;
  impact: Impact;
  nodes: number;
  wcag_reference: string;
  suggested_fix: string;
  affected_nodes: ApiAffectedNode[];
}

export interface ApiRecommendation {
  issue: string;
  impact: string;
  recommendation: string;
  priority: number;
  wcag_reference: string;
  affected_elements: number;
  remediation_complexity: string;
}

export interface ApiSummary {
  total_violations: number;
  violations_by_impact: {
    minor: number;
    serious: number;
    moderate: number;
  };
}

export interface ApiResponse {
  status: string;
  data: {
    url: string;
    timestamp: string;
    analysis: {
      violations: ApiViolation[];
      recommendations: ApiRecommendation[];
    };
    summary: ApiSummary;
  };
  metadata: {
    scanDuration: string;
    version: string;
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  wcagReference: string;
  solution: string;
}

export interface ScanResult {
  score: number;
  issues: Issue[];
  summary: {
    high: number;
    medium: number;
    low: number;
  };
  recommendations: Record<string, string>;
}