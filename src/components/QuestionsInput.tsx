import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionsInputProps {
  questions: string[];
  onChange: (questions: string[]) => void;
  disabled?: boolean;
}

export function QuestionsInput({ questions, onChange, disabled }: QuestionsInputProps) {
  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    onChange(newQuestions);
  };

  const addQuestion = () => {
    onChange([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onChange(newQuestions.length > 0 ? newQuestions : [""]);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-primary">
        Questions
      </Label>
      <p className="text-sm text-muted-foreground">
        Ask one or more questions about your scenario. You can submit multiple questions at once.
      </p>
      
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={question}
              onChange={(e) => updateQuestion(index, e.target.value)}
              disabled={disabled}
              placeholder={`Question ${index + 1}...`}
              className="flex-1 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 disabled:opacity-50"
            />
            {questions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(index)}
                disabled={disabled}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addQuestion}
        disabled={disabled}
        className="w-full border-primary/20 text-primary hover:bg-primary/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Question
      </Button>
    </div>
  );
}