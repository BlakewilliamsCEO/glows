-- Glows. Prospect Database
-- Run once: psql $DATABASE_URL -f lib/schema.sql
-- Railway: paste into the Query tab of the Postgres plugin.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── prospects ────────────────────────────────────────────────────────────────
-- One row per submitted quote form. Partial captures go in prospect_partials.

CREATE TABLE IF NOT EXISTS prospects (
  -- identity
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),

  -- contact
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  phone         TEXT        NOT NULL,
  email         TEXT        NOT NULL,

  -- property
  street        TEXT        NOT NULL,
  city          TEXT        NOT NULL,
  zip           TEXT        NOT NULL,
  home_value    TEXT,
  qualified     BOOLEAN     GENERATED ALWAYS AS (
                  home_value IN ('500-750','750-1m','1m-1.5m','over-1.5m')
                ) STORED,

  -- intent
  interests     TEXT[],
  coverage      TEXT,
  stories       TEXT,
  structures    TEXT,
  timeline      TEXT,
  hear_about    TEXT,
  notes         TEXT,
  sms_consent   BOOLEAN     NOT NULL DEFAULT FALSE,

  -- ── Facebook attribution ─────────────────────────────────────────────────
  -- fbclid   : raw click ID from URL (?fbclid=...)
  -- fbc      : _fbc cookie  →  fb.1.{timestamp}.{fbclid}
  -- fbp      : _fbp cookie  →  fb.1.{timestamp}.{random}
  -- event_id : shared with the Pixel for CAPI deduplication
  --            Meta requires the same event_id on both pixel.track() and CAPI
  --            to avoid counting the same conversion twice.
  fbclid        TEXT,
  fbc           TEXT,
  fbp           TEXT,
  event_id      TEXT,

  -- ── Google / other attribution ───────────────────────────────────────────
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

  -- ── pipeline status ───────────────────────────────────────────────────────
  status        TEXT        NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','contacted','quoted','won','lost'))
);

-- ─── prospect_partials ────────────────────────────────────────────────────────
-- Fired when the visitor gives us an email or phone before submitting.
-- Roughly half of form starts never complete — this catches them.

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
);

-- ─── indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS prospects_email       ON prospects (email);
CREATE INDEX IF NOT EXISTS prospects_phone       ON prospects (phone);
CREATE INDEX IF NOT EXISTS prospects_created_at  ON prospects (created_at DESC);
CREATE INDEX IF NOT EXISTS prospects_status      ON prospects (status);
CREATE INDEX IF NOT EXISTS prospects_fbclid      ON prospects (fbclid) WHERE fbclid IS NOT NULL;
CREATE INDEX IF NOT EXISTS prospects_gclid       ON prospects (gclid)  WHERE gclid  IS NOT NULL;
