import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

interface RecommendationItemProps {
  title: string;
  description: string;
  onApply: () => void;
  isApplying?: boolean;
}

export function RecommendationItem({ 
  title, 
  description, 
  onApply,
  isApplying = false 
}: RecommendationItemProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button 
        onClick={onApply} 
        disabled={isApplying}
        variant="secondary"
        className="w-full"
      >
        {isApplying ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Aplicando mejora...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Aplicar mejora
          </>
        )}
      </Button>
    </Card>
  );
}