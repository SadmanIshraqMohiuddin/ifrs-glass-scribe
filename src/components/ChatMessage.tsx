import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    type: "user" | "ai";
    content: string;
    confidence?: number;
    citations?: string[];
    timestamp: Date;
  };
  onEscalate?: () => void;
}

export function ChatMessage({ message, onEscalate }: ChatMessageProps) {
  const isUser = message.type === "user";
  const isLowConfidence = message.confidence && message.confidence < 0.7;

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">AI</span>
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'glass border'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {!isUser && message.confidence && (
            <div className="mt-3 pt-3 border-t border-[hsl(var(--glass-border))]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Confidence:</span>
                  <Badge
                    variant={isLowConfidence ? "destructive" : "secondary"}
                    className={isLowConfidence ? "bg-destructive/20 text-destructive" : ""}
                  >
                    {Math.round(message.confidence * 100)}%
                  </Badge>
                </div>
                
                {isLowConfidence && onEscalate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEscalate}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate to Expert
                  </Button>
                )}
              </div>
              
              {message.citations && message.citations.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Citations: </span>
                  <span className="text-sm text-primary">
                    {message.citations.join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ml-auto mt-2">
            <span className="text-muted-foreground font-semibold text-sm">JD</span>
          </div>
        )}
      </div>
    </div>
  );
}