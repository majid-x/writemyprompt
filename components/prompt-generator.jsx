"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Loader2,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Save,
} from "lucide-react";
import { generatePrompt } from "../lib/generate-prompt";
import ModelSelector from "../components/model-selector";
import PromptTemplates from "../components/prompt-templates";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../context/auth-context";

export default function PromptGenerator() {
  const [userInput, setUserInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useAuth();

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setActiveTab("result");
    setError("");
    setSaveSuccess(false);

    try {
      console.log("Model received in generatePrompt:", selectedModel);

      const result = await generatePrompt(userInput, selectedModel);
      setGeneratedPrompt(result);

      // Automatically save the prompt to MongoDB if user is logged in
      if (user && result) {
        await savePromptToDatabase(result);
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError("An unexpected error occurred. Please try again later.");
      setGeneratedPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  const savePromptToDatabase = async (promptText) => {
    if (!user || !promptText) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          model: selectedModel,
          generatedPrompt: promptText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save prompt");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving prompt:", error);
      setError("Failed to save your prompt. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (template) => {
    setUserInput(template);
  };

  return (
    <Card className="w-full border-gray-200 dark:border-gray-800 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saveSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <Check className="h-4 w-4" />
            <AlertDescription>Prompt saved successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="input" className="text-sm sm:text-base py-2">
              Input
            </TabsTrigger>
            <TabsTrigger
              value="result"
              disabled={!generatedPrompt && !isGenerating}
              className="text-sm sm:text-base py-2">
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6 mt-2">
            <div className="space-y-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>

            <div className="space-y-4">
              <PromptTemplates onSelectTemplate={handleTemplateSelect} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Request</label>
              <Textarea
                placeholder="Describe what you want to accomplish... (e.g., 'I want to create an e-commerce website with product catalog, shopping cart, and payment processing')"
                className="min-h-[200px] resize-none p-3 text-sm sm:text-base"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full py-2 h-auto min-h-[2.75rem] text-sm sm:text-base"
              disabled={!userInput.trim() || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                "Generate Optimized Prompt"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="result" className="space-y-6 mt-2">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-muted-foreground text-center">
                  Crafting your comprehensive prompt...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div
                    className={`flex ${
                      isMobile
                        ? "flex-col gap-3"
                        : "justify-between items-center"
                    }`}>
                    <h3 className="text-base sm:text-lg font-medium">
                      Optimized for {selectedModel.toUpperCase()}
                    </h3>
                    <div className={`flex ${isMobile ? "w-full" : ""} gap-2`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className={`flex items-center gap-1 h-9 ${
                          isMobile ? "flex-1" : ""
                        }`}
                        disabled={!generatedPrompt}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-muted whitespace-pre-wrap min-h-[300px] overflow-auto max-h-[600px] text-sm leading-relaxed border border-none dark:border-none">
                    {generatedPrompt}
                  </div>
                </div>
                <div
                  className={`flex ${
                    isMobile ? "flex-col gap-3" : "justify-between"
                  }`}>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("input")}
                    className={`${
                      isMobile ? "w-full" : ""
                    } flex items-center gap-1`}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Input
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!userInput.trim()}
                    className={`${
                      isMobile ? "w-full" : ""
                    } flex items-center gap-1`}>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
