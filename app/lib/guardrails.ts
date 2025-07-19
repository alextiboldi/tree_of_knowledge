/**
 * Guardrails and Safety System for Magical Knowledge Tree
 * Implements keyword filtering, sentiment analysis, topic classification, and content validation
 */

// Keyword blacklist for inappropriate content
const INAPPROPRIATE_KEYWORDS = [
  // Violence and harm
  "kill",
  "murder",
  "death",
  "suicide",
  "hurt",
  "pain",
  "blood",
  "weapon",
  "gun",
  "knife",
  "bomb",
  "explosive",
  "fight",
  "war",
  "attack",
  "violence",
  "abuse",
  "torture",

  // Adult content
  "sex",
  "sexual",
  "porn",
  "nude",
  "naked",
  "breast",
  "penis",
  "vagina",
  "prostitute",
  "drug",
  "alcohol",
  "beer",
  "wine",
  "cigarette",
  "smoke",
  "marijuana",
  "cocaine",

  // Inappropriate language
  "damn",
  "hell",
  "crap",
  "stupid",
  "idiot",
  "hate",
  "ugly",
  "fat",
  "loser",

  // Scary/disturbing content
  "ghost",
  "demon",
  "devil",
  "monster",
  "scary",
  "nightmare",
  "horror",
  "evil",
  "witch",
  "vampire",
  "zombie",
  "creepy",
  "spooky",
];

// Educational domain keywords for topic classification
const EDUCATIONAL_DOMAINS = {
  science: [
    "science",
    "experiment",
    "physics",
    "chemistry",
    "biology",
    "space",
    "planet",
    "star",
    "animal",
    "plant",
    "water",
    "air",
    "earth",
    "rock",
    "mineral",
    "energy",
    "light",
    "sound",
    "electricity",
    "magnet",
    "gravity",
    "weather",
    "temperature",
    "ice",
    "snow",
  ],
  nature: [
    "nature",
    "environment",
    "forest",
    "tree",
    "flower",
    "bird",
    "fish",
    "insect",
    "ocean",
    "river",
    "mountain",
    "desert",
    "ecosystem",
    "habitat",
    "conservation",
    "recycling",
    "pollution",
    "climate",
    "season",
    "garden",
    "farm",
    "wildlife",
  ],
  math: [
    "math",
    "number",
    "count",
    "add",
    "subtract",
    "multiply",
    "divide",
    "shape",
    "circle",
    "square",
    "triangle",
    "pattern",
    "geometry",
    "fraction",
    "decimal",
    "measurement",
    "time",
    "money",
    "calculator",
    "problem",
    "solution",
    "logic",
  ],
};

// Positive sentiment indicators
const POSITIVE_INDICATORS = [
  "learn",
  "understand",
  "know",
  "discover",
  "explore",
  "find",
  "see",
  "show",
  "tell",
  "explain",
  "teach",
  "help",
  "what",
  "why",
  "how",
  "where",
  "when",
];

// Negative sentiment indicators
const NEGATIVE_INDICATORS = [
  "hate",
  "angry",
  "mad",
  "upset",
  "sad",
  "cry",
  "afraid",
  "scared",
  "worried",
  "confused",
  "frustrated",
  "annoyed",
  "bored",
  "tired",
  "sick",
];

export interface GuardrailResult {
  isAllowed: boolean;
  reason?: string;
  suggestedResponse?: string;
  detectedDomain?: string;
  sentimentScore?: number;
}

export interface ContentValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedContent?: string;
}

export class GuardrailsService {
  /**
   * Main guardrail check for incoming questions
   */
  checkQuestion(question: string): GuardrailResult {
    const normalizedQuestion = question.toLowerCase().trim();

    // 1. Keyword blacklist check
    const keywordCheck = this.checkInappropriateKeywords(normalizedQuestion);
    if (!keywordCheck.isAllowed) {
      return keywordCheck;
    }

    // 2. Sentiment analysis
    const sentimentScore = this.analyzeSentiment(normalizedQuestion);
    if (sentimentScore < -0.5) {
      return {
        isAllowed: false,
        reason: "negative_sentiment",
        suggestedResponse:
          "I can see you might be feeling upset. Let's focus on something fun to learn about instead! What would you like to discover today?",
        sentimentScore,
      };
    }

    // 3. Topic classification
    const topicCheck = this.classifyTopic(normalizedQuestion);
    if (!topicCheck.isAllowed) {
      return topicCheck;
    }

    return {
      isAllowed: true,
      detectedDomain: topicCheck.detectedDomain,
      sentimentScore,
    };
  }

  /**
   * Check for inappropriate keywords
   */
  private checkInappropriateKeywords(text: string): GuardrailResult {
    const words = text.split(/\s+/);

    for (const word of words) {
      if (INAPPROPRIATE_KEYWORDS.includes(word)) {
        return {
          isAllowed: false,
          reason: "inappropriate_keyword",
          suggestedResponse:
            "That's not something our Knowledge Tree can help with right now. Please ask about educational topics like science, nature, or math!",
        };
      }
    }

    return { isAllowed: true };
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(text: string): number {
    const words = text.split(/\s+/);
    let score = 0;
    let wordCount = 0;

    for (const word of words) {
      if (POSITIVE_INDICATORS.includes(word)) {
        score += 1;
        wordCount++;
      } else if (NEGATIVE_INDICATORS.includes(word)) {
        score -= 1;
        wordCount++;
      }
    }

    // Normalize score between -1 and 1
    return wordCount > 0 ? score / wordCount : 0;
  }

  /**
   * Classify if question is educational and determine domain
   */
  private classifyTopic(text: string): GuardrailResult {
    const words = text.split(/\s+/);
    let scienceScore = 0;
    let natureScore = 0;
    let mathScore = 0;
    let totalMatches = 0;

    for (const word of words) {
      if (EDUCATIONAL_DOMAINS.science.includes(word)) {
        scienceScore++;
        totalMatches++;
      }
      if (EDUCATIONAL_DOMAINS.nature.includes(word)) {
        natureScore++;
        totalMatches++;
      }
      if (EDUCATIONAL_DOMAINS.math.includes(word)) {
        mathScore++;
        totalMatches++;
      }
    }

    // If no educational keywords found, still allow but suggest educational topics
    if (totalMatches === 0) {
      // Check if it's a basic question word pattern
      const questionWords = ["what", "why", "how", "where", "when", "who"];
      const hasQuestionWord = questionWords.some((qw) => text.includes(qw));

      if (hasQuestionWord) {
        return {
          isAllowed: true,
          detectedDomain: "general",
        };
      }

      return {
        isAllowed: false,
        reason: "not_educational",
        suggestedResponse:
          "I love helping with educational questions! Try asking about science, nature, animals, space, math, or how things work.",
      };
    }

    // Determine the most likely domain
    let detectedDomain = "general";
    if (scienceScore > natureScore && scienceScore > mathScore) {
      detectedDomain = "Science & Technology";
    } else if (natureScore > mathScore) {
      detectedDomain = "Nature & Environment";
    } else if (mathScore > 0) {
      detectedDomain = "Math & Logic";
    }

    return {
      isAllowed: true,
      detectedDomain,
    };
  }

  /**
   * Validate and sanitize AI-generated content
   */
  validateAIResponse(content: string): ContentValidationResult {
    // Check for inappropriate content in AI response
    const keywordCheck = this.checkInappropriateKeywords(content.toLowerCase());
    if (!keywordCheck.isAllowed) {
      return {
        isValid: false,
        reason: "inappropriate_content_in_response",
      };
    }

    // Check response length (should be appropriate for children)
    if (content.length > 2000) {
      return {
        isValid: false,
        reason: "response_too_long",
      };
    }

    if (content.length < 10) {
      return {
        isValid: false,
        reason: "response_too_short",
      };
    }

    // Sanitize content (remove any potentially problematic patterns)
    const sanitizedContent = this.sanitizeContent(content);

    return {
      isValid: true,
      sanitizedContent,
    };
  }

  /**
   * Sanitize content by removing/replacing problematic patterns
   */
  private sanitizeContent(content: string): string {
    let sanitized = content;

    // Remove any URLs
    sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, "[link removed]");

    // Remove email addresses
    sanitized = sanitized.replace(/\S+@\S+\.\S+/g, "[email removed]");

    // Remove any remaining inappropriate keywords
    INAPPROPRIATE_KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      sanitized = sanitized.replace(regex, "[inappropriate content removed]");
    });

    return sanitized.trim();
  }

  /**
   * Get a fallback response for blocked content
   */
  getFallbackResponse(reason: string): string {
    switch (reason) {
      case "inappropriate_keyword":
        return "That's not something our Knowledge Tree can help with right now. Please ask about educational topics like science, nature, or math!";

      case "negative_sentiment":
        return "I can see you might be feeling upset. Let's focus on something fun to learn about instead! What would you like to discover today?";

      case "not_educational":
        return "I love helping with educational questions! Try asking about science, nature, animals, space, math, or how things work.";

      case "inappropriate_content_in_response":
      case "response_too_long":
      case "response_too_short":
        return "I'm having trouble with that question right now. Can you try asking it in a different way?";

      default:
        return "That's an interesting question! Can you ask it in a different way so I can help you learn something amazing?";
    }
  }
}

// Export singleton instance
export const guardrailsService = new GuardrailsService();
