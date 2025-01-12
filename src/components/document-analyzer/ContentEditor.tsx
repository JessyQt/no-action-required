import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface ContentEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export function ContentEditor({ initialContent, onSave }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Contenido del documento</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Vista previa" : "Editar"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder="Escribe el contenido en formato Markdown..."
          />
          <Button onClick={handleSave}>Guardar cambios</Button>
        </div>
      ) : (
        <Card className="p-6">
          <ScrollArea className="h-[400px]">
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}