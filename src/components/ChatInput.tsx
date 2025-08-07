import { useState } from "react";
import { Paperclip, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScenarioBuilder, ScenarioFormData } from "./ScenarioBuilder";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string, scenario?: ScenarioFormData) => void;
  onUploadFile: () => void;
}

export function ChatInput({ onSendMessage, onUploadFile }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [scenarioData, setScenarioData] = useState<ScenarioFormData>({
    scenario: "",
    document_type: "",
    company_name: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    const isFormComplete = scenarioData.scenario.trim() && scenarioData.document_type && scenarioData.company_name.trim();
    
    if (!isFormComplete) {
      toast({
        title: "Scenario Required",
        description: "Please provide the scenario context before asking your question.",
        variant: "destructive",
      });
      return;
    }

    onSendMessage(message, scenarioData);
    setMessage("");
    setScenarioData({
      scenario: "",
      document_type: "",
      company_name: "",
    });
    setIsFormOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormComplete = scenarioData.scenario.trim() && scenarioData.document_type && scenarioData.company_name.trim();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <ScenarioBuilder
        isOpen={isFormOpen}
        onToggle={() => setIsFormOpen(!isFormOpen)}
        onDataChange={setScenarioData}
        data={scenarioData}
      />
      
      <div className="glass border rounded-full p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="rounded-full w-10 h-10 text-primary hover:bg-primary/10"
        >
          <FileText className="w-5 h-5" />
        </Button>
        
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
          disabled={!message.trim() || !isFormComplete}
          size="icon"
          className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}