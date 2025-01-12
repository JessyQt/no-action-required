import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "serious":
        return <AlertOctagon className="h-4 w-4" />;
      case "moderate":
        return <AlertTriangle className="h-4 w-4" />;
      case "minor":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <Badge className={`flex items-center gap-1 ${getSeverityColor(issue.severity)}`}>
              {getSeverityIcon(issue.severity)}
              {issue.severity.toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{issue.message}</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Impacto:</span> {issue.impact}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Recomendación:</h4>
              <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
            </div>

            {issue.html_element && (
              <div>
                <h4 className="text-sm font-medium mb-1">Elemento Afectado:</h4>
                <pre className="mt-1 p-2 bg-muted rounded text-sm overflow-x-auto">
                  {issue.html_element}
                </pre>
              </div>
            )}

            {issue.wcag_criterion && (
              <p className="text-xs text-muted-foreground">
                Criterio WCAG: {issue.wcag_criterion}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};