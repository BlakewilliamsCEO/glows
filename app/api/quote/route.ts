import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // TODO: forward to HubSpot / trigger agent webhook
    console.log("[quote] received:", JSON.stringify(payload, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
