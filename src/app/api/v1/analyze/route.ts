import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, logApiUsage, getApiUsageCount, getCredential } from "@/lib/db";
import { hashApiKey, decryptApiKey } from "@/lib/crypto";
import { GoogleGenAI } from "@google/genai";
import { DEEP_ANALYSIS_SYSTEM_PROMPT } from "@/lib/analysis-prompt";

export const maxDuration = 60;

const RATE_LIMIT_WINDOW = 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate via Bearer Token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized. Missing or invalid Bearer token." }, { status: 401 });
    }

    const plainKey = authHeader.split(" ")[1];
    const hashedKey = await hashApiKey(plainKey);
    const keyData = await validateApiKey(hashedKey);

    if (!keyData) {
      return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
    }

    // 2. Rate Limiting (DB-based)
    const usageCount = await getApiUsageCount(keyData.id, RATE_LIMIT_WINDOW);
    if (usageCount >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Max ${MAX_REQUESTS_PER_WINDOW} requests per ${RATE_LIMIT_WINDOW}s.` },
        { status: 429 }
      );
    }

    // 3. Get User's Gemini API Key
    const credential = await getCredential(keyData.user_id);
    if (!credential) {
      return NextResponse.json({ error: "Analysis failed. User has no Gemini API key configured." }, { status: 400 });
    }
    const geminiApiKey = await decryptApiKey(credential.api_key_encrypted);

    // 4. Parse Image Data
    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Image data and mimeType are required." }, { status: 400 });
    }

    // 5. Call Gemini 3 Pro
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        { inlineData: { mimeType, data: imageBase64 } },
        { text: DEEP_ANALYSIS_SYSTEM_PROMPT },
      ],
    });

    const responseText = response.text || "";
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return NextResponse.json({ error: "Failed to parse analysis results." }, { status: 500 });
    }

    // 6. Log Usage
    await logApiUsage(keyData.id, keyData.user_id);

    // 7. Filter and Return Response
    // Restricted to: Prompt, Sample, Colors, Design Elements
    return NextResponse.json({
      success: true,
      data: {
        reverseEngineeredPrompt: analysis.reverseEngineeredPrompt,
        samplePrompt: analysis.samplePrompt,
        colorAnalysis: analysis.colorAnalysis,
        designElements: analysis.designElements,
      },
    });
  } catch (error) {
    console.error("POST /api/v1/analyze error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
