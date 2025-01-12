import { Card } from "@/components/ui/card";
import { ScanResult } from "@/lib/types";
import { ReportDownload } from "./ReportDownload";
import { useEffect, useState } from "react";
import { interpretAccessibilityResults } from "@/lib/services/geminiService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Brain, AlertTriangle, AlertOctagon, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ResultsDashboardProps {
  data: ScanResult;
}

const severityIcons = {
  high: <AlertOctagon className="h-5 w-5" />,
  medium: <AlertTriangle className="h-5 w-5" />,
  low: <AlertCircle className="h-5 w-5" />
};

const severityColors = {
  high: "bg-error text-error-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-success text-success-foreground"
};

const severityLabels = {
  high: "Alta Severidad",
  medium: "Media Severidad",
  low: "Baja Severidad"
};

const getComplianceLevel = (score: number) => {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Bueno";
  if (score >= 70) return "Aceptable";
  if (score >= 60) return "Mejorable";
  return "Crítico";
};

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const totalIssues = data.summary.high + data.summary.medium + data.summary.low;
  const complianceLevel = getComplianceLevel(data.score);

  useEffect(() => {
    const getInterpretation = async () => {
      setIsLoading(true);
      try {
        const analysisPromises = data.issues.map(issue =>
          interpretAccessibilityResults({
            ...data,
            issues: [issue]
          })
        );
        const results = await Promise.all(analysisPromises);
        const analysisMap: Record<string, string> = {};
        data.issues.forEach((issue, index) => {
          analysisMap[issue.id] = results[index] || "";
        });
        setAiAnalysis(analysisMap);
      } catch (error) {
        console.error('Error al obtener interpretación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInterpretation();
  }, [data]);

  const issuesByPriority = {
    high: data.issues.filter(issue => issue.severity === "high"),
    medium: data.issues.filter(issue => issue.severity === "medium"),
    low: data.issues.filter(issue => issue.severity === "low")
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Sección A: Resumen General */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Informe de Accesibilidad</h2>
            <ReportDownload data={data} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Puntuación Global</h3>
              <div className="flex items-center justify-center">
                <span className="text-6xl font-bold text-primary">{data.score}</span>
                <span className="text-2xl text-muted-foreground ml-2">/100</span>
              </div>
              <Progress value={data.score} className="h-2" />
              <p className="text-center text-muted-foreground">
                Nivel de Cumplimiento: <span className="font-medium">{complianceLevel}</span>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resumen de Problemas</h3>
              <div className="space-y-3">
                {Object.entries(issuesByPriority).map(([severity, issues]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {severityIcons[severity as keyof typeof severityIcons]}
                      <span>{severityLabels[severity as keyof typeof severityLabels]}</span>
                    </div>
                    <Badge className={severityColors[severity as keyof typeof severityColors]}>
                      {issues.length}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sección B: Análisis Específico por Problema */}
      <Card className="p-6">
        <ScrollArea className="h-[600px] w-full rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {["high", "medium", "low"].map((severity) => (
                issuesByPriority[severity as keyof typeof issuesByPriority].length > 0 && (
                  <div key={severity} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {severityIcons[severity as keyof typeof severityIcons]}
                      {severityLabels[severity as keyof typeof severityLabels]}
                    </h3>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {issuesByPriority[severity as keyof typeof issuesByPriority].map((issue) => (
                        <AccordionItem
                          key={issue.id}
                          value={issue.id}
                          className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-4">
                              <h4 className="text-left font-medium">{issue.title}</h4>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 space-y-6">
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-medium mb-2">Descripción Técnica:</h5>
                                <p className="text-muted-foreground">{issue.description}</p>
                              </div>

                              {aiAnalysis[issue.id] && (
                                <div className="bg-muted p-4 rounded-lg">
                                  <h5 className="font-medium mb-2 flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-primary" />
                                    Impacto en Usuarios
                                  </h5>
                                  <p className="text-muted-foreground whitespace-pre-line">
                                    {aiAnalysis[issue.id]}
                                  </p>
                                </div>
                              )}

                              <div>
                                <h5 className="font-medium mb-2">Solución Recomendada:</h5>
                                <p className="text-muted-foreground">{issue.solution}</p>
                              </div>

                              <div className="pt-2">
                                <a
                                  href={issue.wcagReference}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                                >
                                  Ver guía WCAG
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Sección C: Conclusión y Prioridades */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Plan de Acción Recomendado</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Se recomienda priorizar la resolución de los problemas en el siguiente orden:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            {data.summary.high > 0 && (
              <li>Resolver los {data.summary.high} problemas de alta severidad que afectan críticamante la accesibilidad.</li>
            )}
            {data.summary.medium > 0 && (
              <li>Abordar los {data.summary.medium} problemas de severidad media para mejorar la experiencia de usuario.</li>
            )}
            {data.summary.low > 0 && (
              <li>Finalmente, corregir los {data.summary.low} problemas de baja severidad para optimizar la accesibilidad.</li>
            )}
          </ol>
          <Separator className="my-4" />
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Para más información sobre cómo implementar estas soluciones, consulta la{" "}
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                guía oficial de WCAG
                <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}