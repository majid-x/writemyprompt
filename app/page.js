import PromptGenerator from "@/components/prompt-generator";

export const metadata = {
  title: "AI Prompt Engineer",
  description: "Generate optimized prompts for various LLM models",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2">
          AI Prompt Engineer
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Create optimized prompts for various AI models without technical
          knowledge
        </p>
        <PromptGenerator />
      </div>
    </main>
  );
}
