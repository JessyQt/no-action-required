import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Issue } from "@/lib/types";

interface IssuesSectionProps {
  issues: Issue[];
  aiAnalysis: Record<string, string>;
  isLoading: boolean;
}

export function IssuesSection({ issues, aiAnalysis, isLoading }: IssuesSectionProps) {
  const issuesBySeverity = {
    high: issues.filter(issue => issue.severity === "high"),
    medium: issues.filter(issue => issue.severity === "medium"),
    low: issues.filter(issue => issue.severity === "low")
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <ScrollArea className="h-[600px] w-full rounded-md">
        <div className="space-y-6">
          {Object.entries(issuesBySeverity).map(([severity, severityIssues]) => 
            severityIssues.length > 0 && (
              <div key={severity} className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Problemas de {severity === "high" ? "Alta" : severity === "medium" ? "Media" : "Baja"} Severidad
                </h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {severityIssues.map((issue) => (
                    <AccordionItem
                      key={issue.id}
                      value={issue.id}
                      className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <h4 className="font-medium">{issue.title}</h4>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Descripción:</h5>
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
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}