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
        interests, timeline, hear_about, notes, sms_consent,
        fbclid, fbc, fbp, event_id,
        gclid, ttclid, msclkid,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        landing_path, referrer
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,$12,$13,
        $14,$15,$16,$17,
        $18,$19,$20,
        $21,$22,$23,$24,$25,
        $26,$27
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

    return NextResponse.json({ ok: true, id: prospect.id });
  } catch (err) {
    console.error("[quote] error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
