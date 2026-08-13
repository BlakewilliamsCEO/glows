import { NextRequest, NextResponse } from "next/server";
import { uploadRender, uploadSource } from "@/lib/storage";

const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";

/**
 * V2 render — editorial photography prompt.
 * Primary /render route is untouched and still live for production.
 * Test this at POST /api/visualizer/render-v2
 */
export async function POST(req: NextRequest) {
  try {
    const { image, address } = await req.json();

    if (!image) {
      return NextResponse.json({ ok: false, error: "No image provided" }, { status: 400 });
    }

    if (!OPENAI_KEY) {
      return NextResponse.json({ ok: false, error: "OpenAI API key not configured" }, { status: 500 });
    }

    let imageBase64: string;
    if (image.startsWith("http")) {
      const imgRes = await fetch(image);
      const buffer = await imgRes.arrayBuffer();
      imageBase64 = Buffer.from(buffer).toString("base64");
    } else {
      imageBase64 = image.replace(/^data:image\/\w+;base64,/, "");
    }

    // V2 prompt — editorial architectural photography
    const prompt = `Editorial architectural photography of this exact house at blue hour, shot on Canon EOS R5 with 24mm tilt-shift lens, f/8, 4-second long exposure. Permanent warm white LED architectural lighting (2700K color temperature) is installed along every visible roofline, eave, peak, gable, and soffit — evenly spaced individual points of light following the exact contours of the existing roof structure. The long exposure creates subtle light bloom around each LED. The sky is deep cobalt blue with visible cloud texture and the last amber traces of sunset on the horizon. The driveway and walkway have a faint wet sheen reflecting the warm glow from the roofline. Landscape is softly lit by ambient spill from the LEDs. All architectural details, windows, siding, landscaping, vehicles, and property features remain exactly as they are — nothing is added or removed except the roofline lighting and the transition to blue hour. The result should look like it belongs in Architectural Digest or Luxe Interiors + Design. No visible wires, no clip marks, no construction evidence.${address ? ` This is ${address}.` : ""}`;

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });
    formData.append("image[]", imageBlob, "house.png");
    formData.append("prompt", prompt);
    formData.append("model", "gpt-image-1");
    formData.append("size", "1536x1024");
    formData.append("quality", "high");

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[visualizer-v2] OpenAI edits error:", res.status, errText);
      return NextResponse.json({ ok: false, error: "Render failed" }, { status: 500 });
    }

    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;

    if (!b64) {
      console.error("[visualizer-v2] No image in response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ ok: false, error: "No image generated" }, { status: 500 });
    }

    let imageUrl: string;
    let sourceUrl: string | undefined;
    try {
      [imageUrl, sourceUrl] = await Promise.all([
        uploadRender(b64),
        uploadSource(image),
      ]);
      console.log("[visualizer-v2] saved — source:", sourceUrl, "render:", imageUrl);
    } catch (uploadErr) {
      console.error("[visualizer-v2] R2 upload failed, falling back to base64:", uploadErr);
      imageUrl = `data:image/png;base64,${b64}`;
    }

    return NextResponse.json({ ok: true, imageUrl, sourceUrl });
  } catch (err) {
    console.error("[visualizer-v2] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
