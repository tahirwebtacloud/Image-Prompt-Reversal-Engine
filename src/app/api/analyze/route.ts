import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, getCredential, saveAnalysis } from "@/lib/db";
import { decryptApiKey } from "@/lib/crypto";
import { ANALYSIS_SYSTEM_PROMPT, DEEP_ANALYSIS_SYSTEM_PROMPT } from "@/lib/analysis-prompt";
import { logAnalysisToSheet } from "@/lib/sheets";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60; // Allow up to 60 seconds for Gemini analysis

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's API key
    const credential = await getCredential(user.id);
    if (!credential) {
      return NextResponse.json(
        { error: "No API key configured. Please add your Gemini API key in the Credentials tab." },
        { status: 400 }
      );
    }

    const apiKey = await decryptApiKey(credential.api_key_encrypted);

    // Parse the image from request
    const { imageBase64, mimeType, imageName, mode = "standard" } = await request.json();

    const systemPrompt = mode === "deep" ? DEEP_ANALYSIS_SYSTEM_PROMPT : ANALYSIS_SYSTEM_PROMPT;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Call Gemini 3 Pro for analysis
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        {
          text: systemPrompt,
        },
      ],
    });

    const responseText = response.text || "";

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response (handle possible markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw response:", responseText.substring(0, 500));
      return NextResponse.json(
        {
          error: "Failed to parse analysis results. The AI returned an unexpected format.",
          rawResponse: responseText.substring(0, 2000),
        },
        { status: 500 }
      );
    }

    // Save to database
    const thumbnail = `data:${mimeType};base64,${imageBase64.substring(0, 200)}...`;
    await saveAnalysis(user.id, imageName || "Untitled", thumbnail, analysis);

    // Log to Google Sheets (non-blocking)
    logAnalysisToSheet(session.user.email, imageName || "Untitled", analysis)
      .catch((err) => console.error("Sheets logging failed:", err));

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: unknown) {
    console.error("POST /api/analyze error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Handle specific Gemini API errors
    if (errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid or expired API key. Please update your credentials." },
        { status: 401 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return NextResponse.json(
        { error: "API rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
