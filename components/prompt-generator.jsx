"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Check, AlertCircle } from "lucide-react";
import { generatePrompt } from "@/lib/generate-prompt";
import ModelSelector from "@/components/model-selector";
import PromptTemplates from "@/components/prompt-templates";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PromptGenerator() {
  const [userInput, setUserInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setActiveTab("result");
    setError("");

    try {
      console.log("Model received in generatePrompt:", selectedModel);

      const result = await generatePrompt(userInput, selectedModel);

      // Check if the result contains an error message
      //if (result.startsWith("ERROR:")) {
      //setError(result.replace("ERROR: ", ""));
      //setGeneratedPrompt("");
      // } else {
      setGeneratedPrompt(result);
      //}
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError("An unexpected error occurred. Please try again later.");
      setGeneratedPrompt("");
    } finally {
      setIsGenerating(false);
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
    <Card className="w-full">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger
              value="result"
              disabled={!generatedPrompt && !isGenerating}>
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="space-y-2">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>

            <div className="space-y-2">
              <PromptTemplates onSelectTemplate={handleTemplateSelect} />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Describe what you want to accomplish... (e.g., 'I want to create an e-commerce website with product catalog, shopping cart, and payment processing')"
                className="min-h-[200px] resize-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={!userInput.trim() || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Comprehensive Prompt...
                </>
              ) : (
                "Generate Optimized Prompt"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="result" className="space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Crafting your comprehensive prompt...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Optimized Prompt for {selectedModel.toUpperCase()}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center gap-1"
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
                  <div className="p-4 rounded-md bg-muted whitespace-pre-wrap min-h-[300px] overflow-auto max-h-[600px]">
                    {generatedPrompt}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("input")}>
                    Back to Input
                  </Button>
                  <Button
                    onClick={() => handleGenerate()}
                    disabled={!userInput.trim()}>
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
