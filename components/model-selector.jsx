"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

/**
 * @typedef {Object} ModelSelectorProps
 * @property {string} selectedModel - The currently selected model
 * @property {function} onModelChange - Callback when model changes
 */

const models = [
  {
    id: "gpt",
    name: "OpenAI GPT",
    description: "Best for general tasks, creative writing, and explanations.",
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    description: "Excels at thoughtful analysis and long-form content.",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description:
      "Strong in reasoning, multimodal content, and structured outputs.",
  },
  {
    id: "v0",
    name: "Vercel v0",
    description: "Specialized for web development, UI/UX design, and coding.",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Optimized for coding assistance and debugging.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description:
      "Focused on technical and scientific tasks with high precision.",
  },
  {
    id: "llama",
    name: "Meta Llama",
    description: "Open-source model good for general tasks and local use.",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Efficient model with strong reasoning capabilities.",
  },
];

/**
 * Component for selecting an AI model
 * @param {ModelSelectorProps} props
 */
export default function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Target AI Model</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80 p-3 text-sm">
              <p>
                Select the AI model you'll be using. The prompt will be
                optimized specifically for this model's capabilities and
                requirements.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={selectedModel}
        onValueChange={(value) => onModelChange(value)}>
        <SelectTrigger className="w-full h-auto min-h-[2.5rem] py-2 px-3">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="py-3 px-2 cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground whitespace-normal">
                  {model.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
