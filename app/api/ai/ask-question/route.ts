import { NextRequest, NextResponse } from "next/server";
import { geminiService } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, age, domain, childContext } = body;

    // Validate input
    if (!question) {
      return NextResponse.json(
        { error: "Missing required field: question" },
        { status: 400 }
      );
    }

    // Use provided context or defaults
    const effectiveAge = childContext?.age || age || 8;
    const effectiveDomain =
      domain || childContext?.selectedDomains?.[0] || "science-technology";

    // Build child context
    const context = childContext || {
      age: effectiveAge,
      name: undefined,
      selectedDomains: [effectiveDomain],
    };

    // Process question with Gemini (now includes guardrails and child context)
    const response = await geminiService.askQuestion(
      question,
      effectiveAge,
      effectiveDomain,
      context
    );

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error in ask-question route:", error);
    return NextResponse.json({
      success: false,
      explanation:
        "I'm having trouble right now. Please try asking your question again!",
      drawing_suggestion: "A friendly tree character waving hello",
    });
  }
}
