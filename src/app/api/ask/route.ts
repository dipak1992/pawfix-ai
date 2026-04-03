import { NextRequest, NextResponse } from "next/server";
import { getDogAdvice, type PromptType } from "@/lib/ai";
import { saveQuery } from "@/lib/db";

const VALID_TYPES: PromptType[] = ["food", "emergency", "behavior", "feeding"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, input } = body;

    // Validate required fields
    if (!type || !input) {
      return NextResponse.json(
        { error: "Missing required fields: type and input" },
        { status: 400 }
      );
    }

    // Validate prompt type
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Sanitize input length
    const sanitizedInput = String(input).slice(0, 500).trim();
    if (sanitizedInput.length === 0) {
      return NextResponse.json(
        { error: "Input cannot be empty" },
        { status: 400 }
      );
    }

    // Get AI response
    const result = await getDogAdvice(type as PromptType, sanitizedInput);

    // Save to database (non-blocking, fire-and-forget)
    saveQuery(sanitizedInput, type, JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /ask error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
