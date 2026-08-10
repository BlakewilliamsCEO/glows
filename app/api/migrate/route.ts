import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  await query(`ALTER TABLE prospects ADD COLUMN IF NOT EXISTS structures TEXT`);
  return NextResponse.json({ ok: true });
}
