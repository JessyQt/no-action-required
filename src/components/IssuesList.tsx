import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge className={getSeverityColor(issue.severity)}>
              {issue.severity.toUpperCase()}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">{issue.message}</h3>
          <p className="text-sm text-gray-600 mb-2">Impact: {issue.impact}</p>
          <p className="text-sm">
            <span className="font-medium">Recommendation:</span>{" "}
            {issue.recommendation}
          </p>
          {issue.html_element && (
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
              {issue.html_element}
            </pre>
          )}
        </Card>
      ))}
    </div>
  );
};