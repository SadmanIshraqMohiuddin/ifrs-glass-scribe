import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  type: "answer" | "summary";
  question?: string;
  answer?: string;
  summary?: string;
  question_number?: number;
  timestamp?: string;
}

interface ChatResponseProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatResponse({ messages, isLoading }: ChatResponseProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  // Sort answers by question number if available
  const answers = messages
    .filter((msg) => msg?.type === "answer")
    .sort((a, b) => (a.question_number || 0) - (b.question_number || 0));

  const summary = messages.find((msg) => msg?.type === "summary");

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Q&A Pairs */}
      {answers.map((msg, index) => (
        <div key={index} className="space-y-4">
          {/* User Question */}
          <div className="flex justify-end">
            <div className="max-w-[80%] glass border rounded-2xl rounded-tr-md p-4">
              <p className="text-foreground">{msg.question}</p>
              {msg.timestamp && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* AI Answer */}
          <div className="flex justify-start">
            <div className="max-w-[80%] glass border rounded-2xl rounded-tl-md p-4">
              <div className="max-w-none prose prose-sm text-foreground">
                {msg.answer?.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
              {msg.timestamp && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Loading Animation */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="p-4 rounded-2xl rounded-tl-md border glass">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce bg-primary"></div>
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-primary"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full animate-bounce bg-primary"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground">
                IFRS Advisor is analyzing...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {summary && (
        <div className="p-6 rounded-2xl border glass">
          <Button
            variant="ghost"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
            className="justify-between p-0 w-full h-auto text-left hover:bg-transparent"
          >
            <h3 className="text-lg font-semibold text-primary">
              Summary of Findings
            </h3>
            {summaryExpanded ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-primary" />
            )}
          </Button>

          {summaryExpanded && (
            <div className="mt-4 max-w-none prose prose-sm text-foreground">
              {summary.summary?.split("\n").map((line, i) => {
                if (line.startsWith("• ") || line.startsWith("- ")) {
                  return (
                    <li key={i} className="ml-4">
                      {line.replace(/^[•-]\s*/, "")}
                    </li>
                  );
                }
                if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <p key={i} className="mb-2 font-bold">
                      {line.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                return line.trim() ? (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                ) : null;
              })}
              {summary.timestamp && (
                <p className="mt-4 text-xs text-muted-foreground">
                  {new Date(summary.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

