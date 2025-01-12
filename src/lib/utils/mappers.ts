import { ApiResponse, ScanResult, ApiViolation } from "../types";

const mapSeverity = (impact: string): "high" | "medium" | "low" => {
  switch (impact.toLowerCase()) {
    case "critical":
    case "serious":
      return "high";
    case "moderate":
      return "medium";
    case "minor":
    default:
      return "low";
  }
};

const calculateScore = (violations: ApiViolation[]): number => {
  const baseScore = 100;
  const penaltyPerViolation = {
    critical: 15,
    serious: 10,
    moderate: 5,
    minor: 2
  };

  const totalPenalty = violations.reduce((acc, violation) => {
    return acc + (penaltyPerViolation[violation.impact as keyof typeof penaltyPerViolation] || 2);
  }, 0);

  return Math.max(0, Math.min(100, baseScore - totalPenalty));
};

const formatViolations = (violations: ApiViolation[]): ScanResult['issues'] => {
  return violations.map((violation, index) => ({
    id: `issue-${index}`,
    title: violation.description,
    description: `Encontrado en ${violation.nodes} elemento${violation.nodes > 1 ? 's' : ''}.
                 ${violation.affected_nodes[0]?.html || 'No hay detalles disponibles'}`,
    severity: mapSeverity(violation.impact),
    wcagReference: violation.wcag_reference,
    solution: violation.suggested_fix
  }));
};

const formatRecommendations = (recommendations: ApiResponse['data']['analysis']['recommendations']): Record<string, string> => {
  const formattedRecommendations: Record<string, string> = {};
  recommendations.forEach(rec => {
    formattedRecommendations[rec.issue] = rec.recommendation;
  });
  return formattedRecommendations;
};

export const mapScanResultFromApi = (apiResponse: ApiResponse): ScanResult => {
  const { violations, recommendations } = apiResponse.data.analysis;
  const score = calculateScore(violations);
  const issues = formatViolations(violations);
  const formattedRecommendations = formatRecommendations(recommendations);

  return {
    score,
    issues,
    summary: {
      high: apiResponse.data.summary.violations_by_impact.serious || 0,
      medium: apiResponse.data.summary.violations_by_impact.moderate || 0,
      low: apiResponse.data.summary.violations_by_impact.minor || 0
    },
    recommendations: formattedRecommendations
  };
};