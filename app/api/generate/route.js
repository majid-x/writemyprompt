import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { userInput, model } = await req.json();

    if (!userInput || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if we have an API key
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      return NextResponse.json(
        {
          generatedPrompt:
            "ERROR: OpenAI API key is missing. Please add your API key in the environment variables.",
          error: "API key missing",
        },
        { status: 401 }
      );
    }

    const modelSpecificInstructions = getModelSpecificInstructions(model);

    const { text } = await generateText({
      model: openai({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Explicitly pass the API key here
      }),
      system: `You are an expert prompt engineer who specializes in creating optimized prompts for AI models.
          Your task is to take a simple user request and transform it into a detailed, effective prompt 
          specifically optimized for the ${model.toUpperCase()} AI model.
          
          ${modelSpecificInstructions}
          
          The prompt you create should:
          1. Be clear and specific
          2. Include relevant context and constraints
          3. Break complex tasks into steps when appropriate
          4. Specify the desired output format
          5. Include any necessary examples if helpful
          
          Format your response as a ready-to-use prompt without any explanations or meta-commentary.`,
      prompt: userInput,
    });

    return NextResponse.json({ generatedPrompt: text });
  } catch (error) {
    console.error("Error in generate route:", error);

    if (error.toString().includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API key is invalid or missing" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}

function getModelSpecificInstructions(model) {
  // Same implementation as in lib/generate-prompt.js
  const baseInstructions = `
Create a comprehensive, detailed prompt that follows these best practices:

1. BE SPECIFIC AND DETAILED: Include all necessary context, requirements, and constraints.
2. BREAK DOWN COMPLEX TASKS: Structure the prompt as a series of steps or components.
3. USE EXAMPLES: Include examples of desired outputs when relevant.
4. SPECIFY FORMAT: Clearly define the expected output format (JSON, markdown, etc.).
5. DEFINE SCOPE: Explicitly state what should and should not be included.
6. USE DELIMITERS: Use triple quotes, XML tags, or markdown to separate sections.
7. REQUEST VERIFICATION: Ask the AI to verify its work against requirements.
8. ENCOURAGE THOROUGHNESS: Request comprehensive solutions that cover all aspects.

The prompt should be so complete that the user can get their entire solution in one response without needing follow-up prompts.`;

  switch (model) {
    case "gpt":
      return `${baseInstructions}
      
For OpenAI's GPT models:
- Use system and user message separation
- Leverage JSON mode for structured outputs
- Use temperature settings guidance (0.0 for factual, 0.7 for creative)
- Include specific formatting with markdown
- Use XML tags to clearly separate different parts of the input`;

    case "claude":
      return `${baseInstructions}
      
For Anthropic's Claude:
- Use <Thinking> tags to encourage step-by-step reasoning
- Leverage Claude's strength in following complex instructions
- Use XML tags for clear separation of content
- Include ethical considerations and guardrails
- Specify tone and style explicitly`;

    case "gemini":
      return `${baseInstructions}
      
For Google's Gemini:
- Structure with clear numbered steps
- Use markdown formatting extensively
- Leverage Gemini's multimodal capabilities when relevant
- Include specific examples of desired outputs
- Use code blocks with language specification for code`;

    case "v0":
      return `${baseInstructions}
      
For Vercel's v0:
- Focus on code generation with complete file structures
- Include specific UI component requirements
- Specify frameworks and libraries to use
- Request responsive designs with mobile considerations
- Include accessibility requirements`;

    case "cursor":
      return `${baseInstructions}
      
For Cursor:
- Structure code requests with file paths and complete implementations
- Include test cases and edge case handling
- Specify architecture patterns to follow
- Request documentation and comments
- Include performance considerations`;

    case "deepseek":
      return `${baseInstructions}
      
For DeepSeek:
- Focus on technical precision and completeness
- Include mathematical formulations when relevant
- Request step-by-step explanations
- Specify computational efficiency requirements
- Include validation approaches`;

    case "llama":
      return `${baseInstructions}
      
For Meta's Llama:
- Use clear section headers
- Include specific examples
- Request step-by-step reasoning
- Use markdown for formatting
- Include verification steps`;

    case "mistral":
      return `${baseInstructions}
      
For Mistral AI:
- Use structured formats with clear sections
- Include specific requirements for each component
- Request explanations alongside solutions
- Use code blocks with language specification
- Include validation criteria`;

    default:
      return baseInstructions;
  }
}
