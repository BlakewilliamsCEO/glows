import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { QuotePayload } from "@/lib/lead";

export async function POST(req: NextRequest) {
  try {
    const payload: QuotePayload = await req.json();
    const { attribution } = payload;

    const result = await query(
      `INSERT INTO prospects (
        first_name, last_name, phone, email,
        street, city, zip, home_value,
        interests, coverage, stories, gables, garage, timeline, hear_about, notes, sms_consent,
        fbclid, fbc, fbp, event_id,
        gclid, ttclid, msclkid,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        landing_path, referrer
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,
        $22,$23,$24,
        $25,$26,$27,$28,$29,
        $30,$31
      ) RETURNING id, created_at`,
      [
        payload.firstName,
        payload.lastName,
        payload.phone,
        payload.email,
        payload.street,
        payload.city,
        payload.zip,
        payload.homeValue || null,
        payload.interests,
        payload.coverage || null,
        payload.stories || null,
        payload.gables || null,
        payload.garage || null,
        payload.timeline || null,
        payload.hearAbout || null,
        payload.notes || null,
        payload.smsConsent,
        attribution.fbclid   || null,
        attribution.fbc      || null,
        attribution.fbp      || null,
        payload.eventId      || null,
        attribution.gclid    || null,
        attribution.ttclid   || null,
        attribution.msclkid  || null,
        attribution.utm_source   || null,
        attribution.utm_medium   || null,
        attribution.utm_campaign || null,
        attribution.utm_content  || null,
        attribution.utm_term     || null,
        attribution.landingPath  || null,
        attribution.referrer     || null,
      ],
    );

    const prospect = result.rows[0];
    console.log("[quote] prospect created:", prospect.id);

    // Link any visualizer leads that match this address
    const fullAddress = `${payload.street}, ${payload.city}`;
    await query(
      `UPDATE visualizer_leads SET prospect_id = $1
       WHERE prospect_id IS NULL
         AND address ILIKE '%' || $2 || '%'`,
      [prospect.id, fullAddress],
    ).catch((err) => console.error("[quote] visualizer link error:", err));

    return NextResponse.json({ ok: true, id: prospect.id });
  } catch (err) {
    console.error("[quote] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
