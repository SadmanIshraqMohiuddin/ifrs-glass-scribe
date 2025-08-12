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
  const pendingSummaryRef = useRef<ChatMessage | null>(null);

  const handleSubmit = () => {
    // Prepare for new stream
    setMessages([]);
    setIsLoading(true);
    // Close any existing socket
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }

    // Only connecting to WebSocket; no UI state changes or payload sent.

    // Create WebSocket connection (verbose logging)
    const wsUrl = "wss://104.248.169.227:8000/ws/rag/";
    console.info("[WS] Connecting to", wsUrl);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      try {
        const payload = {
          type: "process_questions",
          background: "Company A owns an office building classified as investment property under IAS 40. The company uses the fair value model. It also holds an internally developed patent with no observable market data, projected to generate income over the next 5 years. The finance team must ensure correct valuation and disclosure of these assets under IFRS 13.",
          questions: [
            "How should Company A value its investment property under the fair value model?",
            "What is the most appropriate valuation technique for the internally developed patent?",
            "What disclosure requirements apply to Level 3 fair value measurements under IFRS 13?"
          ],
          model: "gpt-4o-mini"
        };
        wsRef.current?.send(JSON.stringify(payload));
        console.info("[WS] Opened and payload sent.");
      } catch (err) {
        console.error("[WS] Failed to send payload:", err);
      }
    };

    wsRef.current.onmessage = (event) => {
      const raw = typeof event.data === "string" ? event.data : "";
      try {
        const data = JSON.parse(raw);
        if (data.type === "answer") {
          const msg: ChatMessage = {
            type: "answer",
            question: data.question,
            answer: data.answer,
            question_number: data.question_number,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, msg]);
        } else if (data.type === "summary") {
          const msg: ChatMessage = {
            type: "summary",
            summary: data.summary,
            timestamp: new Date().toISOString(),
          };
          pendingSummaryRef.current = msg;
        } else if (data.type === "complete") {
          if (pendingSummaryRef.current) {
            setMessages(prev => [...prev, pendingSummaryRef.current!]);
            pendingSummaryRef.current = null;
          }
          setIsLoading(false);
          try { wsRef.current?.close(); } catch {}
        } else {
          console.debug("[WS] Ignored message type:", data.type);
        }
      } catch (err) {
        console.error("[WS] Failed to parse message:", err, { preview: raw.slice(0, 200) });
      }
    };

    wsRef.current.onclose = (event) => {
      console.warn("[WS] Closed:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setIsLoading(false);
    };

    wsRef.current.onerror = (error) => {
      console.error("[WS] Error event:", error);
      setIsLoading(false);
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
