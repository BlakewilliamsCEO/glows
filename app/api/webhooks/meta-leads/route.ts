import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN ?? "";

/**
 * GET — Meta webhook verification (hub.challenge handshake).
 * Meta sends this once when you subscribe the webhook in Events Manager.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    console.log("[meta-leads] webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST — Incoming lead from Meta Lead Ads.
 *
 * Meta sends a lightweight notification with the leadgen_id. We need to
 * fetch the full lead data from the Graph API using that ID.
 *
 * Payload shape:
 * {
 *   "entry": [{
 *     "changes": [{
 *       "field": "leadgen",
 *       "value": {
 *         "leadgen_id": "...",
 *         "page_id": "...",
 *         "form_id": "...",
 *         "created_time": 1234567890
 *       }
 *     }]
 *   }]
 * }
 */
export async function POST(req: NextRequest) {
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN ?? "";

  try {
    const body = await req.json();
    const entries = body.entry ?? [];

    for (const entry of entries) {
      const changes = entry.changes ?? [];
      for (const change of changes) {
        if (change.field !== "leadgen") continue;

        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        // Fetch full lead data from Graph API
        const leadRes = await fetch(
          `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${ACCESS_TOKEN}`
        );

        if (!leadRes.ok) {
          console.error("[meta-leads] graph API error:", leadRes.status, await leadRes.text());
          continue;
        }

        const leadData = await leadRes.json();
        const fields = parseLeadFields(leadData.field_data ?? []);

        console.log("[meta-leads] lead received:", {
          id: leadgenId,
          name: fields.fullName,
          email: fields.email,
          phone: fields.phone,
        });

        // Insert into prospects table
        const result = await query(
          `INSERT INTO prospects (
            first_name, last_name, phone, email,
            street, city, zip, home_value,
            interests, coverage, stories, structures, gables, garage, timeline, hear_about, notes, sms_consent,
            utm_source, utm_medium, utm_campaign
          ) VALUES (
            $1,$2,$3,$4,
            $5,$6,$7,$8,
            $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21
          ) RETURNING id, created_at`,
          [
            fields.firstName,
            fields.lastName,
            fields.phone,
            fields.email,
            fields.street ?? "",
            fields.city ?? "",
            fields.zip ?? "",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            "facebook",
            `Meta Lead Ad (form: ${change.value?.form_id ?? "unknown"}, leadgen: ${leadgenId})`,
            false,
            "facebook",
            "paid",
            fields.campaignName ?? null,
          ]
        );

        console.log("[meta-leads] prospect created:", result.rows[0]?.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[meta-leads] error:", err);
    return NextResponse.json({ ok: true }); // Always 200 so Meta doesn't retry endlessly
  }
}

/**
 * Parse Meta's field_data array into a flat object.
 * Meta returns: [{ name: "full_name", values: ["John Doe"] }, ...]
 */
function parseLeadFields(fieldData: Array<{ name: string; values: string[] }>) {
  const get = (name: string) => fieldData.find((f) => f.name === name)?.values?.[0] ?? "";

  const fullName = get("full_name");
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || get("first_name");
  const lastName = nameParts.slice(1).join(" ") || get("last_name");

  return {
    fullName,
    firstName,
    lastName,
    email: get("email"),
    phone: get("phone_number"),
    street: get("street_address"),
    city: get("city"),
    zip: get("zip_code") || get("post_code"),
    campaignName: get("campaign_name") || undefined,
  };
}
