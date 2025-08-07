import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MetadataForm, MetadataFormData } from "./MetadataForm";

interface ChatInputProps {
  onSendMessage: (message: string, metadata?: MetadataFormData) => void;
  onUploadFile: () => void;
}

export function ChatInput({ onSendMessage, onUploadFile }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [metadata, setMetadata] = useState<MetadataFormData>({
    ifrs_standard: "",
    topic: "",
    document_type: "",
    jurisdiction: "",
    intended_use: "",
  });

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message, metadata);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <MetadataForm
        isOpen={isFormOpen}
        onToggle={() => setIsFormOpen(!isFormOpen)}
        onDataChange={setMetadata}
        data={metadata}
      />
      
      <div className="glass border rounded-full p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUploadFile}
          className="rounded-full w-10 h-10 text-primary hover:bg-primary/10"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or describe a scenario..."
          className="flex-1 border-0 bg-transparent resize-none min-h-[40px] max-h-32 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          rows={1}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!message.trim()}
          size="icon"
          className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}