import { s3Client } from '../backend/dist/services/b2Storage.js';
import fs from 'fs';

async function uploadVideo() {
  const { PutObjectCommand } = await import('../backend/node_modules/@aws-sdk/client-s3/dist-cjs/index.js');
  const buffer = fs.readFileSync('backend/uploads/VID-20231026-WA0019.mp4');
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: 'silambam/VID-20231026-WA0019.mp4',
    Body: buffer,
    ContentType: 'video/mp4'
  }));
  console.log('Video uploaded to B2: silambam/VID-20231026-WA0019.mp4');
  process.exit(0);
}

uploadVideo().catch(err => {
  console.error(err);
  process.exit(1);
});
