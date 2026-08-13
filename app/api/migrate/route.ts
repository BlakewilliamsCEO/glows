import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  await query(`
    CREATE TABLE IF NOT EXISTS visualizer_leads (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at  TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
      address     TEXT        NOT NULL,
      prospect_id UUID        REFERENCES prospects(id)
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS viz_leads_created ON visualizer_leads (created_at DESC)`);
  await query(`CREATE INDEX IF NOT EXISTS viz_leads_address ON visualizer_leads (address)`);
  return NextResponse.json({ ok: true });
}
