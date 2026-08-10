import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const result = await query(`SELECT * FROM prospects ORDER BY created_at DESC LIMIT 1`);
  return NextResponse.json(result.rows);
}
