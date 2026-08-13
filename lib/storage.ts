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

  // Public dev URL
  const publicBase = process.env.R2_PUBLIC_URL ?? "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev";
  return `${publicBase}/${key}`;
}
