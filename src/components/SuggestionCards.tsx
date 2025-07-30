import { Upload, HelpCircle, BookOpen, PenTool } from "lucide-react";

interface SuggestionCardsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function SuggestionCards({ onSuggestionClick }: SuggestionCardsProps) {
  const suggestions = [
    {
      icon: Upload,
      title: "Upload a lease agreement to analyze",
      action: "upload"
    },
    {
      icon: HelpCircle,
      title: "Explain lease modifications under IFRS 16",
      action: "question"
    },
    {
      icon: BookOpen,
      title: "What are the key terms in IFRS 9?",
      action: "define"
    },
    {
      icon: PenTool,
      title: "Draft an accounting policy for revenue recognition",
      action: "draft"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.title)}
            className="p-6 glass border rounded-xl glass-hover text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {suggestion.title}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}