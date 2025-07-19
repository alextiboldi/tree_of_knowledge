import { GoogleGenAI } from "@google/genai";
import { guardrailsService } from "./guardrails";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

// Model configuration
const MODEL_NAME = "gemini-2.0-flash-lite";
const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Safety settings to ensure child-friendly content
const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

// System prompt to ensure child-friendly responses
const SYSTEM_PROMPT = `You are a friendly and knowledgeable teacher helping children aged 5-15 learn about various subjects.

Provide age-appropriate explanations that are:
1. Educational and accurate
2. Engaging and encouraging 
3. Safe and positive
4. Brief but informative (2-3 paragraphs maximum)

Always suggest a relevant drawing or illustration that would help explain the concept visually.

Your response will be automatically formatted as JSON with "explanation" and "drawing_suggestion" fields.`;

export interface GeminiResponse {
  explanation: string;
  drawing_suggestion: string;
}

export interface ChildContext {
  age: number;
  name?: string;
  selectedDomains?: string[];
}

export class GeminiService {
  private model = ai.models;

  /**
   * Parse JSON response from AI, handling various formats and edge cases
   */
  private parseJSONResponse(text: string): {
    explanation: string;
    drawing_suggestion: string;
  } {
    // Helper function to validate response format
    const isValidResponse = (obj: any): obj is GeminiResponse => {
      return (
        obj &&
        typeof obj === "object" &&
        typeof obj.explanation === "string" &&
        typeof obj.drawing_suggestion === "string"
      );
    };

    // Helper function to try parsing JSON
    const tryParse = (str: string) => {
      try {
        const parsed = JSON.parse(str);
        return isValidResponse(parsed) ? parsed : null;
      } catch {
        return null;
      }
    };

    let cleanedText = text.trim();

    // 1. Try parsing the raw text first (fastest path)
    const rawResult = tryParse(cleanedText);
    if (rawResult) return rawResult;

    // 2. If that fails, try cleaning markdown and other formatting

    // Remove markdown code block wrapper if present
    cleanedText = cleanedText
      .replace(/^```json\s*/, "") // Remove opening ```json
      .replace(/^```\s*/, "") // Remove opening ```
      .replace(/\s*```$/, "") // Remove closing ```
      .trim();

    // Try parsing the cleaned text
    const cleanedResult = tryParse(cleanedText);
    if (cleanedResult) return cleanedResult;

    // 3. If still no valid JSON, try to extract JSON from the text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedResult = tryParse(jsonMatch[0]);
      if (extractedResult) return extractedResult;
    }

    // 4. Last resort: Try to fix incomplete JSON
    if (cleanedText.startsWith("{") && !cleanedText.endsWith("}")) {
      const fixedResult = tryParse(cleanedText + "}");
      if (fixedResult) return fixedResult;
    }

    // If all parsing attempts fail, log the raw text and throw error
    console.error("Failed to parse AI response. Raw text:", text);
    throw new Error("Could not parse JSON response");
  }

  /**
   * Process a child's question and return an age-appropriate response with drawing suggestion
   */
  async askQuestion(
    question: string,
    age: number,
    domain: string,
    childContext?: ChildContext
  ): Promise<GeminiResponse> {
    try {
      // 1. Apply guardrails to incoming question
      console.log("Checking question:", question);
      const guardrailCheck = guardrailsService.checkQuestion(question);
      console.log("Guardrail check result:", guardrailCheck);

      if (!guardrailCheck.isAllowed) {
        console.log("Question blocked by guardrails:", guardrailCheck.reason);
        return {
          explanation:
            guardrailCheck.suggestedResponse ||
            guardrailsService.getFallbackResponse(guardrailCheck.reason!),
          drawing_suggestion: "A friendly tree character encouraging learning",
        };
      }

      // Use detected domain if available, otherwise use provided domain
      const effectiveDomain =
        guardrailCheck.detectedDomain !== "general"
          ? guardrailCheck.detectedDomain!
          : domain;

      // Add age-specific context to the prompt
      const ageContext = this.getAgeAppropriateContext(
        childContext?.age || age
      );
      const domainContext = this.getDomainContext(effectiveDomain);
      const personalizedContext = this.getPersonalizedContext(childContext);

      const prompt = `${SYSTEM_PROMPT}

CHILD PROFILE:
${personalizedContext}

AGE-SPECIFIC GUIDELINES:
${ageContext}

DOMAIN FOCUS:
${domainContext}

QUESTION: ${question}

Remember to respond in valid JSON format with "explanation" and "drawing_suggestion" fields.`;

      console.log("Sending prompt to Gemini:", prompt);

      const result = await this.model.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          ...DEFAULT_GENERATION_CONFIG,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              explanation: {
                type: "string",
                description:
                  "Age-appropriate explanation of the concept (2-3 paragraphs)",
              },
              drawing_suggestion: {
                type: "string",
                description:
                  "Brief description of what to draw to illustrate the concept",
              },
            },
            required: ["explanation", "drawing_suggestion"],
          },
        },
      });

      const text = result.text || "";
      console.log("Raw response from Gemini:", text);

      // 2. Validate AI response before returning
      const validationResult = guardrailsService.validateAIResponse(text);
      console.log("Validation result:", validationResult);

      if (!validationResult.isValid) {
        console.log("Response failed validation:", validationResult.reason);
        return {
          explanation: guardrailsService.getFallbackResponse(
            validationResult.reason!
          ),
          drawing_suggestion: "A friendly tree character helping with learning",
        };
      }

      try {
        // Parse the JSON response from the API
        console.log("Attempting to parse JSON response");
        const jsonResponse = JSON.parse(text);
        console.log("Successfully parsed JSON:", jsonResponse);

        // Validate the response structure
        if (!jsonResponse.explanation || !jsonResponse.drawing_suggestion) {
          throw new Error(
            "Invalid response structure: missing required fields"
          );
        }

        // Sanitize the parsed response
        const sanitizedResponse = {
          explanation:
            validationResult.sanitizedContent || jsonResponse.explanation,
          drawing_suggestion: jsonResponse.drawing_suggestion,
        };
        console.log("Final sanitized response:", sanitizedResponse);

        return sanitizedResponse as GeminiResponse;
      } catch (error) {
        console.error("Failed to parse AI response as JSON:", error);
        console.error("Raw response:", text);

        // Try the fallback parser for edge cases
        try {
          const fallbackResponse = this.parseJSONResponse(text);
          return {
            explanation:
              validationResult.sanitizedContent || fallbackResponse.explanation,
            drawing_suggestion: fallbackResponse.drawing_suggestion,
          };
        } catch (fallbackError) {
          console.error("Fallback parsing also failed:", fallbackError);

          // Final fallback response
          return {
            explanation:
              validationResult.sanitizedContent ||
              "I'm having trouble with that question right now. Can you try asking it in a different way?",
            drawing_suggestion:
              "A friendly teacher explaining the concept on a chalkboard",
          };
        }
      }
    } catch (error) {
      console.error("Error processing question with Gemini:", error);
      return {
        explanation:
          "I'm having trouble understanding that question right now. Can you try asking it in a different way?",
        drawing_suggestion: "A friendly tree character thinking",
      };
    }
  }

  /**
   * Get personalized context for the child
   */
  private getPersonalizedContext(childContext?: ChildContext): string {
    if (!childContext) {
      return "Child age and learning preferences not specified.";
    }

    const { age, name, selectedDomains } = childContext;
    let context = `Child is ${age} years old`;

    if (name) {
      context += ` and goes by ${name}`;
    }

    if (selectedDomains && selectedDomains.length > 0) {
      context += `. Learning domains enabled: ${selectedDomains.join(", ")}`;
    }

    return context + ".";
  }

  /**
   * Get age-appropriate context for the AI
   */
  private getAgeAppropriateContext(age: number): string {
    if (age <= 6) {
      return `- Use very simple words (kindergarten level)
- Explain using familiar objects like toys, food, animals, family
- Keep explanations to 2-3 short sentences
- Use lots of descriptive, colorful language
- Include sounds and actions when possible
- Relate everything to play and fun activities`;
    } else if (age <= 8) {
      return `- Use elementary vocabulary with some new words explained
- Compare to school activities, playground experiences, home life
- Use 3-4 sentences with clear structure
- Include simple cause-and-effect relationships
- Encourage questions and exploration
- Use concrete examples they can see or touch`;
    } else if (age <= 10) {
      return `- Use grade-school vocabulary with basic scientific terms
- Explain using examples from daily life, school, and nature
- Provide step-by-step explanations when needed
- Include simple experiments or observations they can try
- Encourage independent thinking
- Use visual analogies and comparisons`;
    } else if (age <= 12) {
      return `- Use middle-school appropriate vocabulary
- Include basic scientific principles and terminology
- Provide more detailed explanations with multiple examples
- Encourage critical thinking and "what if" scenarios
- Include real-world applications and connections
- Challenge them to think deeper about concepts`;
    } else {
      return `- Use age-appropriate scientific terminology with clear definitions
- Include interesting facts and current discoveries
- Provide comprehensive explanations with multiple perspectives
- Encourage analytical thinking and hypothesis formation
- Include career connections and advanced applications
- Challenge them to make connections between different concepts`;
    }
  }

  /**
   * Get domain-specific context for the AI
   */
  private getDomainContext(domain: string): string {
    switch (domain.toLowerCase()) {
      case "science & technology":
      case "science-technology":
        return `SCIENCE & TECHNOLOGY FOCUS:
- Explain scientific concepts, natural phenomena, and how things work
- Use cause-and-effect relationships and logical sequences
- Include real-world examples of technology in daily life
- Encourage curiosity about the "why" and "how" of everything
- Suggest simple observations or experiments when appropriate
- Connect to space, robots, computers, inventions, and discoveries`;

      case "nature & environment":
      case "nature-environment":
        return `NATURE & ENVIRONMENT FOCUS:
- Focus on plants, animals, ecosystems, and environmental protection
- Use examples from nature that children can observe outdoors
- Explain life cycles, habitats, and animal behaviors
- Encourage environmental awareness and care for the planet
- Connect to weather, seasons, and natural phenomena
- Suggest nature activities like bird watching or plant growing`;

      case "math & logic":
      case "math-logic":
        return `MATH & LOGIC FOCUS:
- Focus on numbers, patterns, shapes, and problem-solving
- Use visual examples and step-by-step explanations
- Connect math to real-life situations (cooking, building, games)
- Encourage logical thinking and pattern recognition
- Make abstract concepts concrete with physical examples
- Suggest hands-on activities with counting, measuring, or building`;

      default:
        return `GENERAL EDUCATIONAL FOCUS:
- Provide educational and engaging explanations suitable for young learners
- Use age-appropriate examples and analogies
- Encourage curiosity and further questions
- Connect to the child's everyday experiences`;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
