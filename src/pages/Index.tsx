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

  const { data: results, isLoading: queryLoading } = useQuery<ScanResult>({
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
      // Only refetch if we haven't received a score yet
      return !data || data.score === 0 ? 2000 : false;
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
  
      toast.success("Analysis started! Results will appear shortly.");
    } catch (error) {
      console.error("Error analyzing website:", error);
      toast.error("Failed to analyze website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Web Accessibility Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check your website's accessibility compliance with WCAG guidelines.
            Get instant feedback and recommendations for improvement.
          </p>
        </div>
  
        <URLInput onAnalyze={handleAnalyze} isLoading={isLoading} />
  
        {results && (
          <div className="mt-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Accessibility Score
                </h2>
                <AccessibilityScore score={results.score} />
              </div>
  
              {results.issues && results.issues.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Issues Found</h2>
                    <Button onClick={handleDownloadPDF}>
                      Download PDF Report
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
  