import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export interface Issue {
  id: string;
  severity: string;
  message: string;
  impact: string;
  recommendation: string;
  html_element?: string | null;
  wcag_criterion?: string | null;
  created_at?: string | null;
  scan_id?: string | null;
}

interface IssuesListProps {
  issues: Issue[];
}

export const IssuesList = ({ issues }: IssuesListProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "serious":
        return "bg-error text-error-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "minor":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getIssuesByPriority = () => {
    const priorityOrder = ["critical", "serious", "moderate", "minor"];
    return [...issues].sort(
      (a, b) => 
        priorityOrder.indexOf(a.severity) - priorityOrder.indexOf(b.severity)
    );
  };

  const getSummary = () => {
    const summary = issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return summary;
  };

  const summary = getSummary();
  const sortedIssues = getIssuesByPriority();

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Resumen del Análisis</h2>
        <div className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Se encontraron {issues.length} problemas de accesibilidad que requieren atención.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(summary).map(([severity, count]) => (
              <Card key={severity} className="p-4">
                <Badge className={getSeverityColor(severity)}>
                  {severity.toUpperCase()}
                </Badge>
                <p className="mt-2 text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">
                  {count === 1 ? "problema" : "problemas"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Detailed Issues Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Análisis Detallado</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {sortedIssues.map((issue, index) => (
            <AccordionItem key={issue.id} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4">
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <span className="text-left font-medium">{issue.message}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Impacto en Usuarios</h4>
                    <p className="text-muted-foreground">{issue.impact}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Solución Recomendada</h4>
                    <p className="text-muted-foreground">{issue.recommendation}</p>
                  </div>

                  {issue.wcag_criterion && (
                    <div>
                      <h4 className="font-semibold mb-2">Criterio WCAG</h4>
                      <Badge variant="outline">{issue.wcag_criterion}</Badge>
                    </div>
                  )}

                  {issue.html_element && (
                    <div>
                      <h4 className="font-semibold mb-2">Elemento Afectado</h4>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                        {issue.html_element}
                      </pre>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};