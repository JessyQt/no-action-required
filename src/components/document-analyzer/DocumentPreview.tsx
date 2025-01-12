import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface DocumentPreviewProps {
  content: string;
}

export function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Vista previa del documento</h3>
      <ScrollArea className="h-[600px]">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </Card>
  );
}