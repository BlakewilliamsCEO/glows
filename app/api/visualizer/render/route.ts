import { NextRequest, NextResponse } from "next/server";
import { uploadRender, uploadSource } from "@/lib/storage";

const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const { image, address } = await req.json();

    if (!image) {
      return NextResponse.json({ ok: false, error: "No image provided" }, { status: 400 });
    }

    if (!OPENAI_KEY) {
      return NextResponse.json({ ok: false, error: "OpenAI API key not configured" }, { status: 500 });
    }

    // If image is a URL (Street View), fetch it and convert to base64
    let imageBase64: string;
    if (image.startsWith("http")) {
      const imgRes = await fetch(image);
      const buffer = await imgRes.arrayBuffer();
      imageBase64 = Buffer.from(buffer).toString("base64");
    } else {
      imageBase64 = image.replace(/^data:image\/\w+;base64,/, "");
    }

    const prompt = `Transform this daytime photo of a house into a photorealistic nighttime/dusk scene with permanent LED architectural lighting installed along all visible rooflines, eaves, peaks, and gables. The lights should be warm white (2700K color temperature), evenly spaced, and follow the exact contours of the existing roof structure. The house structure, landscaping, driveway, and all architectural details must remain exactly the same — only add the lighting and change the sky to dusk/night. Make it look like a real photo taken at twilight, not a rendering. The lighting should cast a subtle warm glow on the fascia and soffit.${address ? ` This is ${address}.` : ""}`;

    // Use the Images Edit endpoint with gpt-image-1
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
      console.error("[visualizer] OpenAI edits error:", res.status, errText);
      return NextResponse.json({ ok: false, error: "Render failed" }, { status: 500 });
    }

    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;

    if (!b64) {
      console.error("[visualizer] No image in response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ ok: false, error: "No image generated" }, { status: 500 });
    }

    // Persist both source and render to R2
    let imageUrl: string;
    let sourceUrl: string | undefined;
    try {
      [imageUrl, sourceUrl] = await Promise.all([
        uploadRender(b64),
        uploadSource(image),
      ]);
      console.log("[visualizer] saved — source:", sourceUrl, "render:", imageUrl);
    } catch (uploadErr) {
      console.error("[visualizer] R2 upload failed, falling back to base64:", uploadErr);
      imageUrl = `data:image/png;base64,${b64}`;
    }

    return NextResponse.json({ ok: true, imageUrl, sourceUrl });
  } catch (err) {
    console.error("[visualizer] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
