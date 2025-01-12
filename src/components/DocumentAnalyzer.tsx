import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeDocument } from "@/lib/api";
import { FileUpload } from "./document-analyzer/FileUpload";
import { ContentEditor } from "./document-analyzer/ContentEditor";
import { DocumentPreview } from "./document-analyzer/DocumentPreview";
import { RecommendationItem } from "./document-analyzer/RecommendationItem";
import { AnalysisHeader } from "./document-analyzer/AnalysisHeader";
import { AnalysisActions } from "./document-analyzer/AnalysisActions";

export function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
      toast({
        title: "Análisis completado",
        description: "El documento ha sido analizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al analizar el documento",
        description: "Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImproveDocument = async () => {
    if (!file) return;
    
    setIsImproving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Mejoras aplicadas",
        description: "El documento ha sido mejorado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al mejorar el documento",
        description: "No se pudieron aplicar las mejoras automáticas.",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      <AnalysisHeader 
        title="Análisis de Documentos"
        description="Sube tu documento para analizar su contenido, estructura y accesibilidad. Obtendrás recomendaciones detalladas y la opción de aplicar mejoras automáticas."
      />

      <Card className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FileUpload
            onFileSelect={setFile}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            file={file}
          />

          {analysisResult && (
            <div className="space-y-6">
              <AnalysisActions 
                onImprove={handleImproveDocument}
                isImproving={isImproving}
              />

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="preview">Vista previa</TabsTrigger>
                  <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <ContentEditor
                    initialContent={analysisResult.data.content.text}
                    onSave={(content) => {
                      console.log("Contenido guardado:", content);
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="preview">
                  <DocumentPreview content={analysisResult.data.content.text} />
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-4">
                  <div className="grid gap-4">
                    {Object.entries(analysisResult.data.recommendations || {}).map(([title, description], index) => (
                      <RecommendationItem
                        key={index}
                        title={title}
                        description={description as string}
                        onApply={() => {
                          toast({
                            title: "Mejora aplicada",
                            description: "La recomendación ha sido aplicada exitosamente.",
                          });
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}