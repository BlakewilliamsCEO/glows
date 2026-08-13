import { NextRequest, NextResponse } from "next/server";

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
      imageBase64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    } else {
      // Already a data URL from file upload
      imageBase64 = image;
    }

    // Use GPT-4o image generation to render the home with lights
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_image",
                image_url: imageBase64,
              },
              {
                type: "input_text",
                text: `Transform this daytime photo of a house into a photorealistic nighttime/dusk scene with permanent LED architectural lighting installed along all visible rooflines, eaves, peaks, and gables. The lights should be warm white (2700K color temperature), evenly spaced, and follow the exact contours of the existing roof structure. The house structure, landscaping, driveway, and all architectural details must remain exactly the same — only add the lighting and change the sky to dusk/night. Make it look like a real photo taken at twilight, not a rendering. The lighting should cast a subtle warm glow on the fascia and soffit.${address ? ` This is ${address}.` : ""}`,
              },
            ],
          },
        ],
        tools: [
          {
            type: "image_generation",
            quality: "high",
            size: "1536x1024",
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[visualizer] OpenAI error:", err);
      return NextResponse.json({ ok: false, error: "Render failed" }, { status: 500 });
    }

    const data = await res.json();

    // Extract the generated image from the response
    const imageOutput = data.output?.find(
      (item: { type: string }) => item.type === "image_generation_call",
    );

    if (!imageOutput?.result) {
      console.error("[visualizer] No image in response:", JSON.stringify(data));
      return NextResponse.json({ ok: false, error: "No image generated" }, { status: 500 });
    }

    // Return the base64 image as a data URL
    const resultUrl = `data:image/png;base64,${imageOutput.result}`;

    return NextResponse.json({ ok: true, imageUrl: resultUrl });
  } catch (err) {
    console.error("[visualizer] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
