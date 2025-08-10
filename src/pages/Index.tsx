import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundInput } from "@/components/BackgroundInput";
import { QuestionsInput } from "@/components/QuestionsInput";
import { ChatResponse } from "@/components/ChatResponse";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  type: "answer" | "summary";
  question?: string;
  answer?: string;
  summary?: string;
  question_number?: number;
  timestamp?: string;
}

const Index = () => {
  const [background, setBackground] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!background.trim()) {
      toast({
        title: "Background Required",
        description: "Please provide a background description before submitting.",
        variant: "destructive",
      });
      return;
    }

    const validQuestions = questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      toast({
        title: "Questions Required",
        description: "Please add at least one question.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);
    setMessages([]);

    // Create WebSocket connection (verbose logging)
    const wsUrl = "wss://104.248.169.227:8443/ws/rag/";
    console.info("[WS] Connecting to", wsUrl);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      const payload = {
        type: "process_questions",
        background: background.trim(),
        questions: validQuestions,
        model: "gpt-4o-mini",
      };
      const payloadStr = JSON.stringify(payload);
      console.info("[WS] Opened. Sending payload:", {
        length: payloadStr.length,
        preview: payloadStr.slice(0, 500),
      });
      try {
        wsRef.current?.send(payloadStr);
      } catch (err) {
        console.error("[WS] Send failed:", err);
        toast({
          title: "Failed to send request",
          description: String(err),
          variant: "destructive",
        });
      }
    };

    wsRef.current.onmessage = (event) => {
      const raw = typeof event.data === "string" ? event.data : "";
      console.debug("[WS] Message received:", {
        length: raw.length,
        preview: raw.slice(0, 500),
      });
      try {
        const data = JSON.parse(raw);
        console.debug("[WS] Parsed message:", data);
        if (data.type === "answer" || data.type === "summary") {
          const message: ChatMessage = {
            ...data,
            timestamp: new Date().toISOString(),
          };
          
          setMessages(prev => [...prev, message]);
          
          // Scroll to bottom
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      } catch (error) {
        console.error("[WS] Error parsing message:", error, { rawPreview: raw.slice(0, 500) });
        toast({
          title: "Invalid response received",
          description: "We received an unexpected message format from the server.",
          variant: "destructive",
        });
      }
    };

    wsRef.current.onclose = (event) => {
      console.warn("[WS] Closed:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setIsLoading(false);
      if (!event.wasClean) {
        toast({
          title: "Connection closed unexpectedly",
          description: `Code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
          variant: "destructive",
        });
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("[WS] Error event:", error);
      setIsLoading(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to IFRS Advisor. Check network and try again.",
        variant: "destructive",
      });
    };
  };

  const handleReset = () => {
    setBackground("");
    setQuestions([""]);
    setMessages([]);
    setIsLoading(false);
    setIsSubmitted(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        console.info("[WS] Component unmount: closing socket");
        wsRef.current.close();
      }
    };
  }, []);

  const isFormValid = background.trim() && questions.some(q => q.trim());

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            IFRS AI Assistant
          </h1>
          <p className="text-muted-foreground text-lg">
            Provide background context and ask multiple questions for comprehensive IFRS guidance
          </p>
        </div>

        {/* Input Form */}
        {!isSubmitted && (
          <div className="glass border rounded-2xl p-8 space-y-8 mb-8">
            <BackgroundInput
              value={background}
              onChange={setBackground}
              disabled={isLoading}
            />
            
            <QuestionsInput
              questions={questions}
              onChange={setQuestions}
              disabled={isLoading}
            />

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit to IFRS Advisor
            </Button>
          </div>
        )}

        {/* Submitted Context Display */}
        {isSubmitted && (
          <div className="glass border rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Your Submission</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                Start New Session
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Background:</h4>
                <p className="text-foreground">{background}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Questions:</h4>
                <ul className="space-y-1">
                  {questions.filter(q => q.trim()).map((question, index) => (
                    <li key={index} className="text-foreground">
                      {index + 1}. {question}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Chat Responses */}
        <ChatResponse messages={messages} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
