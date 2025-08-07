import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface MetadataFormData {
  ifrs_standard: string;
  topic: string;
  document_type: string;
  jurisdiction: string;
  intended_use: string;
}

interface MetadataFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onDataChange: (data: MetadataFormData) => void;
  data: MetadataFormData;
}

export function MetadataForm({ isOpen, onToggle, onDataChange, data }: MetadataFormProps) {
  const handleFieldChange = (field: keyof MetadataFormData, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full glass border mb-3 justify-between text-primary hover:bg-primary/10"
        >
          <span className="text-sm font-medium">Context Settings</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="glass border rounded-lg p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IFRS Standard */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-primary uppercase tracking-wide">
                IFRS Standard
              </Label>
              <Select
                value={data.ifrs_standard}
                onValueChange={(value) => handleFieldChange("ifrs_standard", value)}
              >
                <SelectTrigger className="glass border-[hsl(var(--glass-border))] bg-transparent text-foreground">
                  <SelectValue placeholder="Select IFRS standard" />
                </SelectTrigger>
                <SelectContent className="glass border-[hsl(var(--glass-border))] bg-background/95 backdrop-blur-lg">
                  <SelectItem value="IFRS 15">IFRS 15</SelectItem>
                  <SelectItem value="IFRS 16">IFRS 16</SelectItem>
                  <SelectItem value="IFRS 9">IFRS 9</SelectItem>
                  <SelectItem value="IAS 1">IAS 1</SelectItem>
                  <SelectItem value="IAS 37">IAS 37</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-primary uppercase tracking-wide">
                Topic
              </Label>
              <Input
                value={data.topic}
                onChange={(e) => handleFieldChange("topic", e.target.value)}
                placeholder="e.g., Lease Modifications"
                className="glass border-[hsl(var(--glass-border))] bg-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-primary uppercase tracking-wide">
                Document Type
              </Label>
              <Select
                value={data.document_type}
                onValueChange={(value) => handleFieldChange("document_type", value)}
              >
                <SelectTrigger className="glass border-[hsl(var(--glass-border))] bg-transparent text-foreground">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="glass border-[hsl(var(--glass-border))] bg-background/95 backdrop-blur-lg">
                  <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                  <SelectItem value="Revenue Contract">Revenue Contract</SelectItem>
                  <SelectItem value="Financial Statement">Financial Statement</SelectItem>
                  <SelectItem value="Audit Memo">Audit Memo</SelectItem>
                  <SelectItem value="Policy Draft">Policy Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jurisdiction */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-primary uppercase tracking-wide">
                Jurisdiction
              </Label>
              <Select
                value={data.jurisdiction}
                onValueChange={(value) => handleFieldChange("jurisdiction", value)}
              >
                <SelectTrigger className="glass border-[hsl(var(--glass-border))] bg-transparent text-foreground">
                  <SelectValue placeholder="Select applicable region" />
                </SelectTrigger>
                <SelectContent className="glass border-[hsl(var(--glass-border))] bg-background/95 backdrop-blur-lg">
                  <SelectItem value="International">International</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="EU">EU</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Intended Use */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-medium text-primary uppercase tracking-wide">
                Intended Use
              </Label>
              <Select
                value={data.intended_use}
                onValueChange={(value) => handleFieldChange("intended_use", value)}
              >
                <SelectTrigger className="glass border-[hsl(var(--glass-border))] bg-transparent text-foreground">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent className="glass border-[hsl(var(--glass-border))] bg-background/95 backdrop-blur-lg">
                  <SelectItem value="Interpretation">Interpretation</SelectItem>
                  <SelectItem value="Disclosure Drafting">Disclosure Drafting</SelectItem>
                  <SelectItem value="Compliance Check">Compliance Check</SelectItem>
                  <SelectItem value="Audit Preparation">Audit Preparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}