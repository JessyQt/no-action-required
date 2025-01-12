import { Button } from "@/components/ui/button";
import { ScanResult } from "@/lib/types";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

interface ReportDownloadProps {
  data: ScanResult;
}

export function ReportDownload({ data }: ReportDownloadProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 20;

    // Configuración de estilos
    const styles = {
      title: { size: 20, spacing: 10 },
      subtitle: { size: 16, spacing: 8 },
      normal: { size: 12, spacing: 6 },
      small: { size: 10, spacing: 5 }
    };

    // Helper para añadir texto con formato
    const addText = (text: string, style: keyof typeof styles, isCenter = false) => {
      doc.setFontSize(styles[style].size);
      if (isCenter) {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pageWidth - textWidth) / 2, yPosition);
      } else {
        doc.text(text, margin, yPosition);
      }
      yPosition += styles[style].spacing;
    };

    // Helper para añadir texto con salto de línea
    const addParagraph = (text: string, style: keyof typeof styles) => {
      doc.setFontSize(styles[style].size);
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * styles[style].spacing;
    };

    // Título y fecha
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    addText("Informe de Accesibilidad Web", "title", true);
    addText(date, "small", true);
    yPosition += 10;

    // Resumen general
    addText("Resumen General", "subtitle");
    addParagraph(`Puntuación de Accesibilidad: ${data.score}/100`, "normal");
    addParagraph(`Nivel de Cumplimiento: ${getComplianceLevel(data.score)}`, "normal");
    yPosition += 10;

    // Resumen de problemas
    addText("Resumen de Problemas", "subtitle");
    if (data.summary.high > 0) {
      addParagraph(`• Alta Severidad: ${data.summary.high} problemas`, "normal");
    }
    if (data.summary.medium > 0) {
      addParagraph(`• Media Severidad: ${data.summary.medium} problemas`, "normal");
    }
    if (data.summary.low > 0) {
      addParagraph(`• Baja Severidad: ${data.summary.low} problemas`, "normal");
    }
    yPosition += 10;

    // Análisis detallado de problemas
    addText("Análisis Detallado", "subtitle");

    // Función para añadir problemas por severidad
    const addIssuesBySeverity = (severity: "high" | "medium" | "low", title: string) => {
      const issues = data.issues.filter(issue => issue.severity === severity);
      if (issues.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 50) {
          doc.addPage();
          yPosition = 20;
        }
        addText(title, "subtitle");
        issues.forEach((issue, index) => {
          if (yPosition > doc.internal.pageSize.height - 50) {
            doc.addPage();
            yPosition = 20;
          }
          addParagraph(`${index + 1}. ${issue.title}`, "normal");
          addParagraph(`Descripción: ${issue.description}`, "small");
          addParagraph(`Solución: ${issue.solution}`, "small");
          addParagraph(`Referencia WCAG: ${issue.wcagReference}`, "small");
          yPosition += 5;
        });
      }
    };

    addIssuesBySeverity("high", "Problemas de Alta Severidad");
    addIssuesBySeverity("medium", "Problemas de Media Severidad");
    addIssuesBySeverity("low", "Problemas de Baja Severidad");

    // Plan de acción
    if (yPosition > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPosition = 20;
    }
    
    addText("Plan de Acción Recomendado", "subtitle");
    addParagraph("Se recomienda abordar los problemas en el siguiente orden:", "normal");
    
    if (data.summary.high > 0) {
      addParagraph(`1. Resolver los ${data.summary.high} problemas de alta severidad que afectan críticamante la accesibilidad.`, "normal");
    }
    if (data.summary.medium > 0) {
      addParagraph(`2. Abordar los ${data.summary.medium} problemas de severidad media para mejorar la experiencia de usuario.`, "normal");
    }
    if (data.summary.low > 0) {
      addParagraph(`3. Finalmente, corregir los ${data.summary.low} problemas de baja severidad para optimizar la accesibilidad.`, "normal");
    }

    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(styles.small.size);
      doc.setTextColor(128);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin - 20,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("informe-accesibilidad.pdf");
  };

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 80) return "Bueno";
    if (score >= 70) return "Aceptable";
    if (score >= 60) return "Mejorable";
    return "Crítico";
  };

  return (
    <Button
      onClick={generatePDF}
      className="bg-primary hover:bg-primary/90"
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar PDF
    </Button>
  );
}