export function ThinkingAnimation() {
  return (
    <div className="flex gap-4 mb-6 justify-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-semibold text-sm">AI</span>
      </div>
      
      <div className="max-w-[70%]">
        <div className="glass border p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Thinking</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}