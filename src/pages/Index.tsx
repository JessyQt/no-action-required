import { useState } from "react";
import { URLInput } from "@/components/URLInput";
import { AccessibilityScore } from "@/components/AccessibilityScore";
import { IssuesList, Issue } from "@/components/IssuesList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ScanResult {
  score: number;
  issues: Issue[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  const { data: results } = useQuery<ScanResult>({
    queryKey: ["scan-results", currentScanId],
    queryFn: async () => {
      if (!currentScanId) return { score: 0, issues: [] };
  
      const { data: scan } = await supabase
        .from("accessibility_scans")
        .select()
        .eq("id", currentScanId)
        .single();
  
      const { data: issues } = await supabase
        .from("accessibility_issues")
        .select()
        .eq("scan_id", currentScanId);
  
      return {
        score: scan?.score || 0,
        issues: issues || [],
      };
    },
    enabled: !!currentScanId,
    refetchInterval: (data) => {
      if (!data?.score) return 2000;
      return false;
    },
  });
  
  const handleAnalyze = async (url: string) => {
    try {
      setIsLoading(true);
      console.log("Starting analysis for URL:", url);
  
      const { data: scan, error: scanError } = await supabase
        .from("accessibility_scans")
        .insert({ url, score: 0 })
        .select()
        .single();
  
      if (scanError) throw scanError;
      console.log("Created scan record:", scan);
  
      setCurrentScanId(scan.id);
  
      const { error } = await supabase.functions.invoke("analyze-accessibility", {
        body: { url, scanId: scan.id },
      });
  
      if (error) {
        throw error;
      }
  
      toast.success("Análisis iniciado. Los resultados aparecerán en breve.");
    } catch (error) {
      console.error("Error analyzing website:", error);
      toast.error("Error al analizar el sitio web. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Analizador de Accesibilidad Web
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verifica el cumplimiento de accesibilidad de tu sitio web con las pautas WCAG.
            Obtén retroalimentación instantánea y recomendaciones para mejorar.
          </p>
        </div>
  
        <URLInput onAnalyze={handleAnalyze} isLoading={isLoading} />
  
        {results && (
          <div className="mt-12 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Puntuación de Accesibilidad
                </h2>
                <AccessibilityScore score={results.score} />
              </div>
  
              {results.issues && results.issues.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Problemas Encontrados</h2>
                    <Button onClick={() => console.log("Download PDF")}>
                      Descargar Informe PDF
                    </Button>
                  </div>
                  <IssuesList issues={results.issues} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;