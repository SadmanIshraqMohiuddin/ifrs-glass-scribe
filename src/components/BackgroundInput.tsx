import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BackgroundInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function BackgroundInput({ value, onChange, disabled }: BackgroundInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="background" className="text-lg font-semibold text-primary">
        Background
      </Label>
      <Textarea
        id="background"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Describe your IFRS scenario here... (e.g., Company X entered into a 10-year lease with escalating rents.)"
        className="min-h-[120px] bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-primary/20 disabled:opacity-50"
        rows={5}
      />
      {!value.trim() && (
        <p className="text-sm text-destructive">
          * Background description is required
        </p>
      )}
    </div>
  );
}