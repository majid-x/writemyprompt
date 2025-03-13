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
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80 bg-white dark:bg-gray-900 text-black dark:text-white p-2 shadow-md rounded-md">
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
        <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg px-4 py-2 shadow-sm">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg">
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition">
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
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
