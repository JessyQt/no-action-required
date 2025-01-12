import axios from "axios";
import { ScanResult, ApiResponse, ApiViolation } from "./types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

export const analyzeSite = async (url: string): Promise<ScanResult> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_URL}/api/analyze`, 
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    const { violations, recommendations } = response.data.data.analysis;
    const score = calculateScore(violations);
    const issues = formatViolations(violations);
    const formattedRecommendations = formatRecommendations(recommendations);

    return {
      score,
      issues,
      summary: {
        high: response.data.data.summary.violations_by_impact.serious || 0,
        medium: response.data.data.summary.violations_by_impact.moderate || 0,
        low: response.data.data.summary.violations_by_impact.minor || 0
      },
      recommendations: formattedRecommendations
    };
  } catch (error) {
    console.error("Error al analizar el sitio:", error);
    throw error;
  }
};

export const analyzeDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${API_URL}/api/analyze-document-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al analizar el documento:", error);
    throw error;
  }
};