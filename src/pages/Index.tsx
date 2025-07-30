import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SuggestionCards } from "@/components/SuggestionCards";
import { ChatInput } from "@/components/ChatInput";
import { UserProfile } from "@/components/UserProfile";
import { ChatMessage } from "@/components/ChatMessage";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  confidence?: number;
  citations?: string[];
  timestamp: Date;
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    // In a real app, load messages for this chat
    setMessages([]);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Based on IFRS 16, regarding your question about "${content.slice(0, 50)}...", here's my analysis:\n\n• Lease modifications should be assessed as separate leases if they increase scope and consideration proportionally\n• If not separate, remeasure lease liability using revised terms\n• Adjust right-of-use asset by difference in liability adjustment`,
        confidence: Math.random() > 0.3 ? 0.85 : 0.65,
        citations: ["IFRS 16.44", "IFRS 16.45", "IFRS 16.46"],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleUploadFile = () => {
    console.log("File upload triggered");
    // Add file upload logic here
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleEscalate = () => {
    console.log("Escalating to expert...");
    // Add escalation logic here
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <ChatSidebar
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-[hsl(var(--glass-border))] flex items-center justify-end px-6">
          <UserProfile />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {showWelcome ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Hello. How can I assist with IFRS today?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload documents, ask questions, or explore IFRS guidance
                </p>
              </div>
              
              <SuggestionCards onSuggestionClick={handleSuggestionClick} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onEscalate={message.confidence && message.confidence < 0.7 ? handleEscalate : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-[hsl(var(--glass-border))] p-6">
            <ChatInput
              onSendMessage={handleSendMessage}
              onUploadFile={handleUploadFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
