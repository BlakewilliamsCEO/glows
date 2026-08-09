import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // TODO: persist partial lead to HubSpot / CRM
    console.log("[quote/partial] received:", JSON.stringify(payload, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote/partial] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
