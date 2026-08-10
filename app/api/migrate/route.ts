import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await query(`
    CREATE TABLE IF NOT EXISTS prospects (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
      first_name    TEXT        NOT NULL,
      last_name     TEXT        NOT NULL,
      phone         TEXT        NOT NULL,
      email         TEXT        NOT NULL,
      street        TEXT        NOT NULL,
      city          TEXT        NOT NULL,
      zip           TEXT        NOT NULL,
      home_value    TEXT,
      qualified     BOOLEAN     GENERATED ALWAYS AS (
                      home_value IN ('500-750','750-1m','1m-1.5m','over-1.5m')
                    ) STORED,
      interests     TEXT[],
      coverage      TEXT,
      timeline      TEXT,
      hear_about    TEXT,
      notes         TEXT,
      sms_consent   BOOLEAN     NOT NULL DEFAULT FALSE,
      fbclid        TEXT,
      fbc           TEXT,
      fbp           TEXT,
      event_id      TEXT,
      gclid         TEXT,
      ttclid        TEXT,
      msclkid       TEXT,
      utm_source    TEXT,
      utm_medium    TEXT,
      utm_campaign  TEXT,
      utm_content   TEXT,
      utm_term      TEXT,
      landing_path  TEXT,
      referrer      TEXT,
      status        TEXT        NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new','contacted','quoted','won','lost'))
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS prospect_partials (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
      email         TEXT,
      phone         TEXT,
      fbclid        TEXT,
      fbc           TEXT,
      fbp           TEXT,
      utm_source    TEXT,
      utm_medium    TEXT,
      utm_campaign  TEXT,
      landing_path  TEXT,
      referrer      TEXT
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS prospects_email      ON prospects (email)`);
  await query(`CREATE INDEX IF NOT EXISTS prospects_phone      ON prospects (phone)`);
  await query(`CREATE INDEX IF NOT EXISTS prospects_created_at ON prospects (created_at DESC)`);
  await query(`CREATE INDEX IF NOT EXISTS prospects_status     ON prospects (status)`);
  await query(`CREATE INDEX IF NOT EXISTS prospects_fbclid     ON prospects (fbclid) WHERE fbclid IS NOT NULL`);
  await query(`CREATE INDEX IF NOT EXISTS prospects_gclid      ON prospects (gclid)  WHERE gclid  IS NOT NULL`);

  return NextResponse.json({ ok: true, message: "Schema applied" });
}
