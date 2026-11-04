import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import mime from "mime-types";

const {
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
} = process.env;

const requiredConfig = {
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
};

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingConfig.length > 0) {
  throw new Error(
    `[b2Storage] Missing required configuration: ${missingConfig.join(", ")}`
  );
}

const endpoint = B2_ENDPOINT!.replace(/\/+$/, "");
const bucket = B2_BUCKET_NAME!;
const objectPrefix = "silambam/";

export const s3Client = new S3Client({
  endpoint,
  region: B2_REGION!,
  credentials: {
    accessKeyId: B2_APPLICATION_KEY_ID!,
    secretAccessKey: B2_APPLICATION_KEY!,
  },
  forcePathStyle: true,
});

export function validateKey(key: string): void {
  if (
    !key.startsWith(objectPrefix) ||
    key.includes("\\") ||
    key.split("/").some((part) => part === "..") ||
    key.includes("\0")
  ) {
    throw new Error("Invalid B2 object key or prefix");
  }
}

/**
 * Returns permanent usable URL for an asset stored in the private B2 bucket.
 * Routes through the authenticated streaming proxy `/api/public/media/stream/:key`
 * with long-lived Cache-Control and ETag validation.
 */
export function getUsableB2Url(key: string): string {
  validateKey(key);
  return `/api/public/media/stream/${key}`;
}

export function publicUrl(key: string): string {
  return getUsableB2Url(key);
}

export async function uploadToB2(
  file: Express.Multer.File,
  _isPublic = true
): Promise<{ key: string; url: string }> {
  if (!file?.path) {
    throw new Error("Upload file path is missing");
  }

  const extension = path.extname(file.originalname);
  const key = `${objectPrefix}${randomUUID()}${extension}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype || "application/octet-stream",
      })
    );

    const url = getUsableB2Url(key);
    return { key, url };
  } finally {
    try {
      await fs.promises.unlink(file.path);
    } catch (error) {
      console.warn("[b2Storage] Could not remove temporary upload file.");
    }
  }
}

export async function uploadBufferToB2(
  buffer: Buffer,
  originalname: string,
  mimetype: string
): Promise<{ key: string; url: string }> {
  const extension = path.extname(originalname);
  const key = `${objectPrefix}${randomUUID()}${extension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype || "application/octet-stream",
    })
  );

  const url = getUsableB2Url(key);
  return { key, url };
}

export async function getObjectFromB2(key: string): Promise<{
  body: NodeJS.ReadableStream;
  contentType: string;
  contentLength?: number;
  eTag?: string;
  lastModified?: Date;
}> {
  validateKey(key);

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return {
    body: response.Body as NodeJS.ReadableStream,
    contentType: response.ContentType || (mime.lookup(key) as string) || "application/octet-stream",
    contentLength: response.ContentLength,
    eTag: response.ETag,
    lastModified: response.LastModified,
  };
}

export async function deleteFromB2(key: string): Promise<void> {
  validateKey(key);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export async function getUrlForKey(
  key: string,
  _isPublic = true
): Promise<string> {
  return getUsableB2Url(key);
}
