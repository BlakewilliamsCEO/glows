import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const CAL_SECRET = process.env.CAL_WEBHOOK_SECRET ?? "";

/**
 * Cal.com webhook receiver.
 * Handles booking events (created, rescheduled, cancelled, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { triggerEvent, payload } = body;

    console.log("[cal] webhook received:", triggerEvent);

    // Verify secret if configured
    if (CAL_SECRET) {
      const headerSecret = req.headers.get("x-cal-signature-256") ?? "";
      // Cal.com sends the secret in the payload or as a header depending on config
      if (body.secret && body.secret !== CAL_SECRET) {
        console.warn("[cal] invalid secret");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    switch (triggerEvent) {
      case "BOOKING_CREATED": {
        const attendee = payload?.attendees?.[0];
        const name = attendee?.name ?? "";
        const email = attendee?.email ?? "";
        const phone = attendee?.phone ?? payload?.responses?.phone?.value ?? "";
        const nameParts = name.trim().split(/\s+/);

        console.log("[cal] booking created:", { name, email, phone, start: payload?.startTime });

        // Update existing prospect if email matches, otherwise create new
        const existing = await query(
          `SELECT id FROM prospects WHERE email = $1 LIMIT 1`,
          [email]
        );

        if (existing.rows.length > 0) {
          await query(
            `UPDATE prospects SET notes = COALESCE(notes, '') || $1, timeline = 'booked' WHERE id = $2`,
            [
              `\nCal.com booking: ${payload?.startTime ?? "unknown"} — ${payload?.title ?? ""}`,
              existing.rows[0].id,
            ]
          );
          console.log("[cal] updated existing prospect:", existing.rows[0].id);
        } else {
          const result = await query(
            `INSERT INTO prospects (
              first_name, last_name, phone, email,
              street, city, zip, home_value,
              interests, timeline, hear_about, notes, sms_consent,
              utm_source
            ) VALUES (
              $1,$2,$3,$4,
              $5,$6,$7,$8,
              $9,$10,$11,$12,$13,
              $14
            ) RETURNING id`,
            [
              nameParts[0] || "",
              nameParts.slice(1).join(" ") || "",
              phone,
              email,
              "",
              "",
              "",
              null,
              null,
              "booked",
              "cal.com",
              `Cal.com booking: ${payload?.startTime ?? "unknown"} — ${payload?.title ?? ""}`,
              false,
              "cal.com",
            ]
          );
          console.log("[cal] new prospect created:", result.rows[0]?.id);
        }
        break;
      }

      case "BOOKING_CANCELLED": {
        const attendee = payload?.attendees?.[0];
        const email = attendee?.email ?? "";
        if (email) {
          await query(
            `UPDATE prospects SET notes = COALESCE(notes, '') || $1 WHERE email = $2`,
            [`\nBooking CANCELLED: ${payload?.startTime ?? "unknown"}`, email]
          );
          console.log("[cal] booking cancelled for:", email);
        }
        break;
      }

      case "BOOKING_RESCHEDULED": {
        const attendee = payload?.attendees?.[0];
        const email = attendee?.email ?? "";
        if (email) {
          await query(
            `UPDATE prospects SET notes = COALESCE(notes, '') || $1 WHERE email = $2`,
            [`\nBooking RESCHEDULED to: ${payload?.startTime ?? "unknown"}`, email]
          );
          console.log("[cal] booking rescheduled for:", email);
        }
        break;
      }

      default:
        console.log("[cal] unhandled event:", triggerEvent, JSON.stringify(body).slice(0, 200));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cal] error:", err);
    return NextResponse.json({ ok: true }); // Always 200 so Cal doesn't retry endlessly
  }
}
