import { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface ScenarioFormData {
  scenario: string;
  document_type: string;
  company_name: string;
}

interface ScenarioBuilderProps {
  isOpen: boolean;
  onToggle: () => void;
  onDataChange: (data: ScenarioFormData) => void;
  data: ScenarioFormData;
}

const documentTypes = [
  "Lease Agreement",
  "Revenue Contract", 
  "Financial Statement",
  "Policy Draft",
  "Audit Memo",
  "Other"
];

export function ScenarioBuilder({ isOpen, onToggle, onDataChange, data }: ScenarioBuilderProps) {
  const [formData, setFormData] = useState<ScenarioFormData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof ScenarioFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const isFormComplete = formData.scenario.trim() && formData.document_type && formData.company_name.trim();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 text-primary hover:bg-primary/10"
        >
          <FileText className="w-5 h-5" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="glass border rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenario" className="text-sm font-medium text-primary">
              Scenario or Background *
            </Label>
            <Textarea
              id="scenario"
              value={formData.scenario}
              onChange={(e) => handleChange("scenario", e.target.value)}
              placeholder="e.g., Company X entered into a 10-year lease with escalating annual rents..."
              className="min-h-[100px] bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-primary/20"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type" className="text-sm font-medium text-primary">
              Document Type *
            </Label>
            <Select value={formData.document_type} onValueChange={(value) => handleChange("document_type", value)}>
              <SelectTrigger className="bg-background/50 border-border/50 text-foreground focus:ring-primary/20">
                <SelectValue placeholder="Select a related document" />
              </SelectTrigger>
              <SelectContent className="glass border">
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-foreground hover:bg-primary/10">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-sm font-medium text-primary">
              Company Name *
            </Label>
            <Input
              id="company-name"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              placeholder="e.g., Company X"
              className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20"
            />
          </div>

          {!isFormComplete && (
            <p className="text-sm text-muted-foreground">
              * All fields are required before submitting your question
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}