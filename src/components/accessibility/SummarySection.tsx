import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { ReportDownload } from "@/components/ReportDownload";
import { ScanResult } from "@/lib/types";

interface SummarySectionProps {
  data: ScanResult;
}

const getComplianceLevel = (score: number) => {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Bueno";
  if (score >= 70) return "Aceptable";
  if (score >= 60) return "Mejorable";
  return "Crítico";
};

export function SummarySection({ data }: SummarySectionProps) {
  const complianceLevel = getComplianceLevel(data.score);
  const totalIssues = data.summary.high + data.summary.medium + data.summary.low;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Informe de Accesibilidad</h2>
          <ReportDownload data={data} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Evaluación Global</h3>
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
              {data.summary.high > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-destructive" />
                    <span>Alta Severidad</span>
                  </div>
                  <Badge variant="destructive">{data.summary.high}</Badge>
                </div>
              )}
              {data.summary.medium > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>Media Severidad</span>
                  </div>
                  <Badge variant="warning">{data.summary.medium}</Badge>
                </div>
              )}
              {data.summary.low > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Baja Severidad</span>
                  </div>
                  <Badge variant="secondary">{data.summary.low}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Se han detectado un total de {totalIssues} problemas que afectan la accesibilidad del sitio.
            {complianceLevel === "Crítico" || complianceLevel === "Mejorable" 
              ? " Se requiere atención inmediata para mejorar la experiencia de usuarios con discapacidades."
              : " Se recomienda revisar y corregir los problemas identificados para garantizar una mejor experiencia."}
          </p>
        </div>
      </div>
    </Card>
  );
}