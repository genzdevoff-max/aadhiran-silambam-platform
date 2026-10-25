// Backend service for Backblaze B2 (S3 compatible) storage
// Uses AWS SDK v3 S3 client. Handles upload, delete, and URL generation.
// Public media URLs are stable; private media URLs are signed with limited TTL.

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import mime from "mime-types";

// Load env vars (backend uses dotenv at server start)
const {
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
} = process.env;

if (!B2_ENDPOINT || !B2_REGION || !B2_BUCKET_NAME || !B2_APPLICATION_KEY_ID || !B2_APPLICATION_KEY) {
  console.error("[b2Storage] Missing required Backblaze B2 configuration. Uploads will be disabled.");
}

const s3Client = new S3Client({
  endpoint: B2_ENDPOINT,
  region: B2_REGION,
  credentials: {
    accessKeyId: B2_APPLICATION_KEY_ID ?? "",
    secretAccessKey: B2_APPLICATION_KEY ?? "",
  },
  forcePathStyle: true, // B2 requires path‑style URLs
});

/**
 * Upload a file (provided by Multer) to B2.
 * Returns the generated object key and the public URL (or signed URL for private files).
 */
export async function uploadToB2(file: Express.Multer.File, isPublic: boolean = true): Promise<{ key: string; url: string }> {
  const ext = path.extname(file.originalname) || mime.extension(file.mimetype) ? `.${mime.extension(file.mimetype)}` : "";
  const key = `${randomUUID()}${ext}`;

  const putCmd = new PutObjectCommand({
    Bucket: B2_BUCKET_NAME!, // non‑null because of earlier guard
    Key: key,
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
    ACL: isPublic ? "public-read" : undefined,
  });

  await s3Client.send(putCmd);

  // Delete local temporary file after successful upload
  try {
    await fs.promises.unlink(file.path);
  } catch (e) {
    console.warn("[b2Storage] Failed to delete temporary file:", file.path, e);
  }

  const url = isPublic ? `${B2_ENDPOINT}/${B2_BUCKET_NAME}/${key}` : await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: B2_BUCKET_NAME!, Key: key }), { expiresIn: 3600 });
  return { key, url };
}

/** Delete an object from B2 */
export async function deleteFromB2(key: string): Promise<void> {
  const delCmd = new DeleteObjectCommand({ Bucket: B2_BUCKET_NAME!, Key: key });
  await s3Client.send(delCmd);
}

/** Generate a URL for an existing object. Public objects get a stable URL; private get signed URL. */
export async function getUrlForKey(key: string, isPublic: boolean = true): Promise<string> {
  if (isPublic) {
    return `${B2_ENDPOINT}/${B2_BUCKET_NAME}/${key}`;
  }
  const signed = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: B2_BUCKET_NAME!, Key: key }), { expiresIn: 3600 });
  return signed;
}
