
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

const s3Client = new S3Client({
  endpoint,
  region: B2_REGION!,
  credentials: {
    accessKeyId: B2_APPLICATION_KEY_ID!,
    secretAccessKey: B2_APPLICATION_KEY!,
  },
  forcePathStyle: true,
});

function validateKey(key: string): void {
  if (
    !key.startsWith(objectPrefix) ||
    key.includes("\\") ||
    key.split("/").some((part) => part === "..") ||
    key.includes("\0")
  ) {
    throw new Error("Invalid B2 object key or prefix");
  }
}

function publicUrl(key: string): string {
  validateKey(key);
  return `${endpoint}/${bucket}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export async function uploadToB2(
  file: Express.Multer.File,
  isPublic = true
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

    const url = isPublic
      ? publicUrl(key)
      : await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: bucket, Key: key }),
          { expiresIn: 3600 }
        );

    return { key, url };
  } finally {
    try {
      await fs.promises.unlink(file.path);
    } catch (error) {
      console.warn("[b2Storage] Could not remove temporary upload file.");
    }
  }
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
  isPublic = true
): Promise<string> {
  validateKey(key);

  if (isPublic) {
    return publicUrl(key);
  }

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
}
