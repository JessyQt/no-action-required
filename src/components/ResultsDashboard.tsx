import { ScanResult } from "@/lib/types";
import { useEffect, useState } from "react";
import { interpretAccessibilityResults } from "@/lib/services/geminiService";
import { SummarySection } from "./accessibility/SummarySection";
import { IssuesSection } from "./accessibility/IssuesSection";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { AlertCircle, ExternalLink } from "lucide-react";

interface ResultsDashboardProps {
  data: ScanResult;
}

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <SummarySection data={data} />
      <IssuesSection issues={data.issues} aiAnalysis={aiAnalysis} isLoading={isLoading} />
      
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