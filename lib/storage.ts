import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET ?? "glows-renders";

const PUBLIC_BASE = process.env.R2_PUBLIC_URL ?? "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev";

/**
 * Upload a base64-encoded image to R2 and return the public URL.
 */
export async function uploadRender(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const key = `renders/${randomUUID()}.png`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    }),
  );

  return `${PUBLIC_BASE}/${key}`;
}

/**
 * Upload a source image (Street View or uploaded photo) to R2.
 * Accepts either a URL (fetches it) or raw base64.
 */
export async function uploadSource(input: string): Promise<string> {
  let buffer: Buffer;

  if (input.startsWith("http")) {
    const res = await fetch(input);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    const raw = input.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(raw, "base64");
  }

  const key = `sources/${randomUUID()}.jpg`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    }),
  );

  return `${PUBLIC_BASE}/${key}`;
}
