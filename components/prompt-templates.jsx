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
 * @typedef {Object} PromptTemplatesProps
 * @property {function} onSelectTemplate - Callback when a template is selected
 */

const templates = [
  {
    id: "website",
    name: "Website Development",
    template:
      "I need to create a comprehensive website for [PURPOSE/BUSINESS TYPE]. The website should include [KEY FEATURES] and target [TARGET AUDIENCE]. It should have both frontend and backend functionality, with a responsive design, user authentication, and database integration. The design should be [DESIGN STYLE] and the color scheme should be [COLOR SCHEME].",
  },
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    template:
      "I need to build a complete e-commerce platform for selling [PRODUCTS]. The platform should include product catalog, categories, search functionality, shopping cart, checkout process, payment processing, user accounts, order tracking, admin dashboard, and inventory management. The design should be modern, responsive, and optimized for conversion.",
  },
  {
    id: "medical",
    name: "Medical Information",
    template:
      "I need comprehensive information about [DISEASE/CONDITION/TREATMENT]. Please include the definition, causes, pathophysiology, clinical presentation, diagnostic criteria, differential diagnosis, treatment options, management strategies, complications, prognosis, prevention, and latest research. This should be evidence-based and include information relevant for both healthcare providers and patients.",
  },
  {
    id: "app",
    name: "Mobile Application",
    template:
      "I need to develop a mobile app for [PURPOSE] that works on both iOS and Android. The app should include features like [KEY FEATURES], user authentication, data storage, notifications, and [SPECIFIC FUNCTIONALITY]. The UI should be intuitive and follow modern design principles. Please include architecture, component design, state management, API integration, and deployment considerations.",
  },
  {
    id: "research",
    name: "Research Analysis",
    template:
      "I need a comprehensive analysis of [RESEARCH TOPIC] including historical context, current state of research, key theories and frameworks, methodologies used in the field, major findings, controversies or debates, practical applications, limitations of current research, and future directions. Please include references to seminal works and recent studies.",
  },
  {
    id: "business",
    name: "Business Plan",
    template:
      "I need to create a detailed business plan for a [BUSINESS TYPE] targeting [TARGET MARKET]. The plan should include executive summary, company description, market analysis, competitive analysis, product/service line, operations plan, marketing strategy, organizational structure, financial projections (startup costs, revenue forecasts, break-even analysis), funding requirements, and growth strategy.",
  },
];

/**
 * Component for selecting prompt templates
 * @param {PromptTemplatesProps} props
 */
export default function PromptTemplates({ onSelectTemplate }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Use a Template (Optional)</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80 bg-white dark:bg-gray-900 text-black dark:text-white p-2 shadow-md rounded-md">
              <p>
                Select a template as a starting point, then customize it for
                your specific needs. Replace the text in [BRACKETS] with your
                details.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select onValueChange={onSelectTemplate}>
        <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg px-4 py-2 shadow-sm">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg">
          {templates.map((template) => (
            <SelectItem
              key={template.id}
              value={template.template}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition">
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
