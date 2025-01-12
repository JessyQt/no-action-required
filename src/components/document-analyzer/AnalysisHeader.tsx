import React from "react";

interface AnalysisHeaderProps {
  title: string;
  description: string;
}

export function AnalysisHeader({ title, description }: AnalysisHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}