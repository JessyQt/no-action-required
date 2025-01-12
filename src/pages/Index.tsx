import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ScanForm } from "@/components/ScanForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import type { ScanResult } from "@/lib/types";
import { accessibilityApi } from "@/lib/api/accessibilityApi";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Index() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();

  const { mutate: analyzeSite, isPending: isLoading } = useMutation({
    mutationFn: (url: string) => accessibilityApi.analyzeSite(url),
    onSuccess: (scanResult) => {
      setResult(scanResult);
      toast({
        title: "Análisis completado",
        description: `Puntuación de accesibilidad: ${scanResult.score}/100`,
      });
    },
    onError: (error) => {
      console.error("Error al analizar el sitio:", error);
      toast({
        title: "Error al analizar el sitio",
        description: "Por favor verifica la URL e intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8 sm:space-y-12 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          Escáner de Accesibilidad
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Analiza la accesibilidad de tu sitio web o documento y obtén recomendaciones basadas en WCAG.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <Tabs defaultValue="website" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="website">Sitio Web</TabsTrigger>
            <TabsTrigger value="document">Documento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="website" className="space-y-8">
            <ScanForm onScan={analyzeSite} isLoading={isLoading} />
            {result && <ResultsDashboard data={result} />}
          </TabsContent>
          
          <TabsContent value="document">
            <DocumentAnalyzer />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}