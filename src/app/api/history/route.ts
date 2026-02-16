import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, getAnalysisHistory, getAnalysisById } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const analysis = await getAnalysisById(Number(id), user.id);
      if (!analysis) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ analysis });
    }

    const limit = Number(searchParams.get("limit")) || 20;
    const history = await getAnalysisHistory(user.id, limit);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
