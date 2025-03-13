import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generatePrompt(userInput, model) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Check for API key
    if (!process.env.NEXT_PUBLIC_DEMO_MODE && !apiKey) {
      return `ERROR: Gemini API key is missing. Please add your API key in the environment variables.

To fix this:
1. Create a .env.local file in the root of your project
2. Add NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here to the file
3. Restart the development server`;
    }

    const modelSpecificInstructions = getModelSpecificInstructions(model);

    // Simulated response if in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" && !apiKey) {
      return simulatePromptGeneration(userInput, model);
    }

    // Construct the system message
    const systemMessage = `You are an expert prompt engineer who specializes in creating optimized prompts for AI models. 
Your task is to take a simple user request and transform it into a **detailed, structured prompt** for the ${model.toUpperCase()} AI model. 

## IMPORTANT:
- The **output must ONLY be a structured prompt** that the user can directly copy-paste.
- **DO NOT** include explanations, meta-commentary, or XML-like tags.
- **DO NOT** generate a response—only the prompt.
- Ensure that the prompt is structured, concise, and within the LLM’s token limit.
- Format the output as plain text, free from unnecessary markup.
- The prompt should be so thorough that the user can get a COMPLETE solution in a single response without needing follow-up prompts.
IMPORTANT GUIDELINES FOR SPECIFIC USE CASES:

FOR DEVELOPMENT PROJECTS (websites, apps, etc.):
- Include complete architecture requirements (frontend, backend, database)
- Specify all pages/screens with detailed functionality
- Include user flows and edge cases
- Request responsive design with specific breakpoints
- Include authentication and authorization details
- Specify data models and relationships
- Include API endpoints and functionality
- Request error handling and validation
- Include performance, security, and accessibility requirements
- Specify deployment instructions

FOR MEDICAL/SCIENTIFIC INFORMATION:
- Request comprehensive coverage from basic principles to advanced concepts
- Include historical context and development
- Request evidence-based information with latest research
- Include mechanisms of action/pathophysiology
- Request differential diagnoses or comparative analysis
- Include treatment protocols or methodologies
- Request contraindications, side effects, or limitations
- Include patient/practical considerations
- Request visual aids, diagrams, or tables when helpful
- Include references to authoritative sources

### Example Output (correct format):
"Create a website that allows users to... [detailed structured prompt]"

### Example Output (incorrect format):
❌ XML-like structures: <prompt> ... </prompt>
❌ Explanation: "Here is your optimized prompt..."
❌ Meta instructions: "This prompt helps you..."

Now, generate the optimized prompt based on the following user request:

**User Request:** "${userInput}"`;

    // Make API request to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemMessage}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate prompt");
    }

    let generatedPrompt =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    // Remove any XML or unwanted formatting (failsafe)
    generatedPrompt = generatedPrompt.replace(/<\/?[^>]+(>|$)/g, "").trim();

    return generatedPrompt;
  } catch (error) {
    console.error("Error in generatePrompt:", error);
    return `ERROR: ${
      error.message || "Failed to generate prompt. Please try again later."
    }`;
  }
}

// Enhanced simulation function for demo mode
function simulatePromptGeneration(userInput, model) {
  const modelName = model.toUpperCase();
  let promptType = "general";

  // Determine the type of prompt based on user input
  if (
    userInput.toLowerCase().includes("website") ||
    userInput.toLowerCase().includes("app") ||
    userInput.toLowerCase().includes("application") ||
    userInput.toLowerCase().includes("develop") ||
    userInput.toLowerCase().includes("build") ||
    userInput.toLowerCase().includes("create")
  ) {
    promptType = "development";
  } else if (
    userInput.toLowerCase().includes("disease") ||
    userInput.toLowerCase().includes("medical") ||
    userInput.toLowerCase().includes("health") ||
    userInput.toLowerCase().includes("treatment") ||
    userInput.toLowerCase().includes("medicine") ||
    userInput.toLowerCase().includes("doctor")
  ) {
    promptType = "medical";
  }

  // Generate appropriate simulated prompt based on type
  if (promptType === "development") {
    return `I need you to act as a senior full-stack developer with expertise in modern web development.

TASK:
${userInput}

REQUIREMENTS:

1. ARCHITECTURE:
   - Frontend: Create a responsive, accessible UI with modern best practices
   - Backend: Develop a robust API with proper error handling and security
   - Database: Design an efficient data model with proper relationships
   - Authentication: Implement secure user authentication and authorization

2. FRONTEND SPECIFICATIONS:
   - Create all necessary pages/components with detailed UI/UX
   - Implement responsive design for mobile, tablet, and desktop
   - Include form validation and error handling
   - Implement state management and data fetching
   - Ensure accessibility compliance (WCAG AA)
   - Include loading states and error boundaries

3. BACKEND SPECIFICATIONS:
   - Create all necessary API endpoints with detailed functionality
   - Implement data validation and sanitization
   - Include proper error handling and logging
   - Implement authentication and authorization middleware
   - Design efficient database queries and operations
   - Include rate limiting and security measures

4. DATABASE DESIGN:
   - Create a complete data model with all tables/collections
   - Define relationships between entities
   - Include indexes for performance optimization
   - Design for data integrity and consistency

5. DEPLOYMENT:
   - Include instructions for local development setup
   - Provide deployment guidelines for production

6. ADDITIONAL REQUIREMENTS:
   - Include comprehensive error handling
   - Implement logging and monitoring
   - Consider performance optimization
   - Include security best practices
   - Document the codebase and API

Please provide a complete solution with all necessary code, explanations, and implementation details. The solution should be production-ready and follow industry best practices.`;
  } else if (promptType === "medical") {
    return `I need you to act as a medical expert with comprehensive knowledge of current medical research and clinical practice.

TASK:
${userInput}

Please provide a comprehensive analysis covering ALL of the following aspects:

1. OVERVIEW:
   - Complete definition and classification
   - Historical context and development of understanding
   - Epidemiology and prevalence statistics
   - Current medical consensus

2. PATHOPHYSIOLOGY/MECHANISM:
   - Detailed explanation of underlying mechanisms
   - Molecular/cellular processes involved
   - Systemic effects and progression
   - Relevant anatomical and physiological considerations

3. CLINICAL PRESENTATION:
   - Complete list of signs and symptoms
   - Typical progression and variations
   - Common and uncommon presentations
   - Severity classification if applicable

4. DIAGNOSIS:
   - Comprehensive diagnostic criteria
   - Differential diagnosis with detailed comparison
   - Recommended diagnostic tests and procedures
   - Interpretation of test results

5. TREATMENT APPROACHES:
   - First-line and alternative treatment options
   - Medication details (dosages, mechanisms, administration)
   - Non-pharmacological interventions
   - Surgical or procedural interventions if applicable
   - Treatment algorithms and decision trees

6. MANAGEMENT:
   - Acute and long-term management strategies
   - Monitoring requirements and follow-up
   - Complications and their management
   - Prognosis and outcomes

7. SPECIAL CONSIDERATIONS:
   - Age-specific considerations (pediatric, geriatric)
   - Pregnancy and lactation
   - Comorbidities and their impact
   - Special populations

8. PREVENTION:
   - Primary and secondary prevention strategies
   - Risk factor modification
   - Screening recommendations

9. PATIENT EDUCATION:
   - Key information for patients
   - Self-management strategies
   - Warning signs and when to seek care

10. CURRENT RESEARCH:
    - Recent advances and discoveries
    - Ongoing clinical trials
    - Emerging treatments and approaches
    - Areas of scientific uncertainty

Please provide evidence-based information with references to current medical literature and guidelines. Include relevant statistics, clinical pearls, and practical considerations for healthcare providers.`;
  } else {
    return `I need you to act as an expert in ${
      userInput.toLowerCase().includes("write")
        ? "content creation"
        : "problem solving"
    }.

Please help me with the following task in the most comprehensive way possible:

${userInput}

When responding:

1. PROVIDE COMPREHENSIVE COVERAGE:
   - Start with fundamental concepts and progress to advanced details
   - Include all relevant aspects and considerations
   - Leave no important information out

2. STRUCTURE YOUR RESPONSE:
   - Use a clear, logical organization
   - Include numbered sections and subsections
   - Use bullet points for lists and key points

3. INCLUDE PRACTICAL APPLICATION:
   - Provide concrete examples and case studies
   - Include step-by-step instructions where relevant
   - Address common challenges and solutions

4. CONSIDER DIFFERENT PERSPECTIVES:
   - Present multiple viewpoints or approaches
   - Discuss advantages and disadvantages of each
   - Make evidence-based recommendations

5. PROVIDE CONTEXT:
   - Include historical background when relevant
   - Explain the significance and implications
   - Connect to broader principles or systems

6. ENSURE ACCURACY AND CREDIBILITY:
   - Base information on current knowledge and best practices
   - Acknowledge limitations or uncertainties
   - Reference authoritative sources where appropriate

7. MAKE IT ACTIONABLE:
   - Provide clear, specific guidance
   - Include next steps or implementation strategies
   - Address potential obstacles and how to overcome them

Please be thorough and detailed in your response, covering all relevant aspects from beginning to end. Your response should be comprehensive enough that I won't need to ask follow-up questions.`;
  }
}

// Replace the getModelSpecificInstructions function with this enhanced version
function getModelSpecificInstructions(model) {
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
