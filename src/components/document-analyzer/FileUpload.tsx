import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  file: File | null;
}

export function FileUpload({ onFileSelect, isAnalyzing, onAnalyze, file }: FileUploadProps) {
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Formato no válido",
        description: "Por favor, sube un archivo PDF, JPEG o PNG.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Subir documento</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              Arrastra y suelta tu archivo aquí o haz clic para seleccionar
            </span>
            <span className="text-xs text-gray-400">
              PDF, JPEG o PNG (máx. 5MB)
            </span>
          </label>
        </div>
      </div>

      {file && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
          <Button
            onClick={onAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </>
            ) : (
              "Analizar documento"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}