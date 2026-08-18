import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST() {
  try {
    await query(`ALTER TABLE prospects ADD COLUMN IF NOT EXISTS structures TEXT`);
    return NextResponse.json({ ok: true, message: "Migration complete: structures column added" });
  } catch (err) {
    console.error("[migrate] error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
