import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, getApiKeys, createApiKey, revokeApiKey } from "@/lib/db";
import { hashApiKey } from "@/lib/crypto";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const keys = await getApiKeys(user.id);
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("GET /api/keys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    // Generate a random key
    const plainKey = `sk_${Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(24))).toString("hex")}`;
    const hashedKey = await hashApiKey(plainKey);
    const lastFour = plainKey.slice(-4);

    const key = await createApiKey(user.id, name, hashedKey, lastFour);

    return NextResponse.json({ 
      success: true, 
      key: { 
        ...key, 
        plainKey // Only returned once
      } 
    });
  } catch (error) {
    console.error("POST /api/keys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await revokeApiKey(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/keys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
