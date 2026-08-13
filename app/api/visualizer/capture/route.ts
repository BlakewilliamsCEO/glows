import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await query(
      `INSERT INTO visualizer_leads (address) VALUES ($1)`,
      [address],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[visualizer/capture] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
