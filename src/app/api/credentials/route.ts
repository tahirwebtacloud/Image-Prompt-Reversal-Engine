import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, saveCredential, getCredential, deleteCredential } from "@/lib/db";
import { encryptApiKey, decryptApiKey } from "@/lib/crypto";
import { GoogleGenAI } from "@google/genai";

// GET — check if user has credentials
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const credential = await getCredential(user.id);

    return NextResponse.json({
      hasCredential: !!credential,
      isValid: credential?.is_valid || false,
      lastUpdated: credential?.updated_at || null,
      // Return masked key for display
      maskedKey: credential
        ? "••••••••" + (await decryptApiKey(credential.api_key_encrypted)).slice(-6)
        : null,
    });
  } catch (error) {
    console.error("GET /api/credentials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credentials" },
      { status: 500 }
    );
  }
}

// POST — save or update credentials
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

    const { apiKey } = await request.json();
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
      return NextResponse.json(
        { error: "Invalid API key format" },
        { status: 400 }
      );
    }

    // Validate the API key by making a test call
    let isValid = false;
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: "Say 'API key validated' in exactly those words.",
      });
      isValid = !!response.text;
    } catch (validationError) {
      console.error("API key validation failed:", validationError);
      return NextResponse.json(
        { error: "Invalid API key. Please check your Google AI Studio API key and try again." },
        { status: 400 }
      );
    }

    // Encrypt and save
    const encrypted = await encryptApiKey(apiKey.trim());
    await saveCredential(user.id, encrypted, isValid);

    return NextResponse.json({
      success: true,
      isValid,
      maskedKey: "••••••••" + apiKey.trim().slice(-6),
    });
  } catch (error) {
    console.error("POST /api/credentials error:", error);
    return NextResponse.json(
      { error: "Failed to save credentials" },
      { status: 500 }
    );
  }
}

// DELETE — remove credentials
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await deleteCredential(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/credentials error:", error);
    return NextResponse.json(
      { error: "Failed to delete credentials" },
      { status: 500 }
    );
  }
}
