import { Button } from "@/components/ui/button";
import { ScanResult } from "@/lib/types";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

interface ReportDownloadProps {
  data: ScanResult;
}

export function ReportDownload({ data }: ReportDownloadProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 20;

    // Configuración de estilos
    const titleSize = 20;
    const subtitleSize = 16;
    const normalSize = 12;
    const smallSize = 10;
    const lineHeight = 8;
    const sectionSpacing = 15;

    // Función helper para centrar texto
    const centerText = (text: string, y: number, size: number) => {
      doc.setFontSize(size);
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
      return y + lineHeight;
    };

    // Función helper para añadir texto con salto de línea automático
    const addWrappedText = (text: string, y: number, fontSize = normalSize) => {
      doc.setFontSize(fontSize);
      const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(textLines, margin, y);
      return y + (textLines.length * lineHeight);
    };

    // Título y fecha
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    yPosition = centerText("Reporte de Accesibilidad Web", yPosition, titleSize);
    yPosition += 5;
    yPosition = centerText(currentDate, yPosition, smallSize);
    yPosition += sectionSpacing;

    // Puntuación Global
    doc.setFontSize(subtitleSize);
    doc.setFont(undefined, 'bold');
    yPosition = addWrappedText("Puntuación de Accesibilidad", yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(`${data.score}/100`, yPosition, titleSize);
    yPosition += sectionSpacing;

    // Resumen de Problemas
    doc.setFont(undefined, 'bold');
    yPosition = addWrappedText("Resumen de Problemas Encontrados", yPosition, subtitleSize);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    
    const severityLabels = {
      high: "Alta Severidad",
      medium: "Media Severidad",
      low: "Baja Severidad"
    };

    Object.entries(data.summary).forEach(([severity, count]) => {
      yPosition = addWrappedText(
        `${severityLabels[severity as keyof typeof severityLabels]}: ${count}`,
        yPosition
      );
      yPosition += 3;
    });
    yPosition += sectionSpacing;

    // Problemas Detallados
    doc.addPage();
    yPosition = 20;
    
    const severityOrder: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
    
    severityOrder.forEach(severity => {
      const issuesOfSeverity = data.issues.filter(issue => issue.severity === severity);
      
      if (issuesOfSeverity.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont(undefined, 'bold');
        yPosition = addWrappedText(severityLabels[severity], yPosition, subtitleSize);
        yPosition += 10;

        issuesOfSeverity.forEach((issue, index) => {
          if (yPosition > doc.internal.pageSize.height - 50) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFont(undefined, 'bold');
          yPosition = addWrappedText(`${index + 1}. ${issue.title}`, yPosition);
          yPosition += 5;

          doc.setFont(undefined, 'normal');
          doc.setFontSize(smallSize);
          
          // Descripción
          yPosition = addWrappedText(`Descripción: ${issue.description}`, yPosition, smallSize);
          yPosition += 3;
          
          // Solución
          yPosition = addWrappedText(`Solución: ${issue.solution}`, yPosition, smallSize);
          yPosition += 3;
          
          // Referencia WCAG
          yPosition = addWrappedText(`Referencia WCAG: ${issue.wcagReference}`, yPosition, smallSize);
          yPosition += sectionSpacing;
        });
      }
    });

    // Pie de página en cada página
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(smallSize);
      doc.setTextColor(128);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin - 20,
        doc.internal.pageSize.height - 10
      );
    }

    // Guardar el PDF
    doc.save("reporte-accesibilidad.pdf");
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-primary hover:bg-primary/90"
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar PDF
    </Button>
  );
}