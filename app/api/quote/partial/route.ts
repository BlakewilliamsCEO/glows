import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, attribution, fbc, fbp, socialHandle } = await req.json();

    // If socialHandle is provided, update the existing prospect record
    if (socialHandle && email) {
      await query(
        `UPDATE prospects SET notes = COALESCE(notes, '') || $1 WHERE email = $2`,
        [`\nSocial: ${socialHandle}`, email],
      ).catch(() => {});
    }

    await query(
      `INSERT INTO prospect_partials (
        email, phone,
        fbclid, fbc, fbp,
        utm_source, utm_medium, utm_campaign,
        landing_path, referrer
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        email       || null,
        phone       || null,
        attribution?.fbclid      || null,
        fbc         || null,
        fbp         || null,
        attribution?.utm_source  || null,
        attribution?.utm_medium  || null,
        attribution?.utm_campaign|| null,
        attribution?.landingPath || null,
        attribution?.referrer    || null,
      ],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote/partial] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
