import { MessageSquarePlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ selectedChat, onSelectChat, onNewChat }: ChatSidebarProps) {
  const chatHistory = [
    { id: "1", title: "IFRS 16 Lease Modifications", preview: "How to account for rent reductions..." },
    { id: "2", title: "Revenue Recognition Policy", preview: "Draft accounting policy for..." },
    { id: "3", title: "IFRS 9 Impairment", preview: "Expected credit loss calculations..." },
  ];

  return (
    <div className="w-80 h-screen glass border-r flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 border-b border-[hsl(var(--glass-border))]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg">Arbree Solutions</span>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left p-3 rounded-lg glass-hover border transition-all ${
                selectedChat === chat.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {chat.preview}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}