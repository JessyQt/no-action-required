import { Card } from "@/components/ui/card";
import { ScanResult } from "@/lib/types";
import { ReportDownload } from "./ReportDownload";
import { useEffect, useState } from "react";
import { interpretAccessibilityResults } from "@/lib/services/geminiService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Brain, AlertTriangle, AlertOctagon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const totalIssues = data.summary.high + data.summary.medium + data.summary.low;

  useEffect(() => {
    const getInterpretation = async () => {
      setIsLoading(true);
      try {
        // Analizar cada problema individualmente
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Puntuación de Accesibilidad</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">{data.score}</span>
              <span className="text-2xl text-muted-foreground ml-2">/100</span>
            </div>
            <Progress value={data.score} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Resumen de Problemas</h2>
          <div className="space-y-4">
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
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Análisis Detallado</h2>
          </div>
          <ReportDownload data={data} />
        </div>

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
                              <h3 className="text-left font-medium">{issue.title}</h3>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 space-y-6">
                            {aiAnalysis[issue.id] && (
                              <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Brain className="h-4 w-4 text-primary" />
                                  Análisis de IA
                                </h4>
                                <p className="text-muted-foreground whitespace-pre-line">
                                  {aiAnalysis[issue.id]}
                                </p>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-medium mb-2">Descripción del Problema:</h4>
                              <p className="text-muted-foreground">{issue.description}</p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Solución Recomendada:</h4>
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
                                <AlertCircle className="h-4 w-4" />
                              </a>
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
    </div>
  );
}