import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

interface ScanFormProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

export function ScanForm({ onScan, isLoading }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidUrl(url)) {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida (ejemplo: https://ejemplo.com)",
        variant: "destructive",
      });
      return;
    }

    onScan(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="url"
          placeholder="https://ejemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
          aria-label="URL del sitio web"
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-primary hover:bg-primary/90 min-w-[140px]"
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Escaneando...</span>
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              <span>Escanear sitio</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}