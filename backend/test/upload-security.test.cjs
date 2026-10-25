const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');
const express = require('express');
const {
  MAX_UPLOAD_FILE_COUNT,
  MAX_UPLOAD_FILE_SIZE,
  createUploadMiddleware,
  validateUploadedFiles,
} = require('../dist/middleware/upload');
const { errorHandler } = require('../dist/middleware/errorHandler');
const {
  SUPPORTED_MEDIA_TYPES,
  sniffMediaType,
  validateMediaFile,
} = require('../dist/middleware/uploadValidation');

const samples = [
  { name: 'training.jpg', mime: 'image/jpeg', bytes: Buffer.from([0xff, 0xd8, 0xff, 0xe0]) },
  { name: 'poster.png', mime: 'image/png', bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { name: 'web-image.webp', mime: 'image/webp', bytes: Buffer.from('RIFF0000WEBP') },
  { name: 'animation.gif', mime: 'image/gif', bytes: Buffer.from('GIF89a') },
  { name: 'demo.mp4', mime: 'video/mp4', bytes: Buffer.from('0000ftypisom') },
  { name: 'demo.webm', mime: 'video/webm', bytes: Buffer.from([0x1a, 0x45, 0xdf, 0xa3]) },
  { name: 'document.pdf', mime: 'application/pdf', bytes: Buffer.from('%PDF-1.7') },
];

const createServer = (middleware = createUploadMiddleware()) => {
  const app = express();
  app.post('/upload', middleware.array('files', MAX_UPLOAD_FILE_COUNT), validateUploadedFiles, async (req, res) => {
    const files = req.files;
    await Promise.all(files.map((file) => fs.unlink(file.path)));
    res.status(201).json({
      files: files.map((file) => ({ filename: file.filename, mime: file.mimetype })),
    });
  });
  app.use(errorHandler);
  const server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({
        server,
        url: `http://127.0.0.1:${server.address().port}/upload`,
      });
    });
  });
};

const sendFiles = async (url, files) => {
  const form = new FormData();
  for (const file of files) {
    form.append('files', new Blob([file.bytes], { type: file.mime }), file.name);
  }
  return fetch(url, { method: 'POST', body: form });
};

test('accepts the supported signature-matched file formats with generated safe names', async (t) => {
  const { server, url } = await createServer();
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await sendFiles(url, samples);
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.files.length, samples.length);
  assert.ok(body.files.every((file) => /^[0-9a-f-]{36}\.[a-z0-9]+$/i.test(file.filename)));
  assert.deepEqual(body.files.map((file) => file.mime), samples.map((file) => file.mime));
});

test('rejects MIME spoofing, mismatched extensions, invalid signatures, SVG, and unsupported formats', async (t) => {
  const { server, url } = await createServer();
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const invalidCases = [
    { name: 'spoof.jpg', mime: 'image/png', bytes: samples[0].bytes },
    { name: 'wrong-extension.png', mime: 'image/jpeg', bytes: samples[0].bytes },
    { name: 'invalid.jpg', mime: 'image/jpeg', bytes: Buffer.from('not an image') },
    { name: 'unsafe.svg', mime: 'image/svg+xml', bytes: Buffer.from('<svg/>') },
    { name: 'payload.exe', mime: 'application/octet-stream', bytes: Buffer.from('MZ') },
  ];

  for (const file of invalidCases) {
    const response = await sendFiles(url, [file]);
    assert.equal(response.status, 400, `${file.name} should be rejected`);
    const body = await response.json();
    assert.match(body.message, /Unsupported or invalid media file|Upload rejected/);
  }
});

test('enforces per-file size and file-count limits in the upload middleware', async (t) => {
  assert.equal(MAX_UPLOAD_FILE_SIZE, 100 * 1024 * 1024);
  assert.equal(MAX_UPLOAD_FILE_COUNT, 15);
  const { server, url } = await createServer(createUploadMiddleware({ fileSize: 8, files: 1 }));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const tooLarge = await sendFiles(url, [{
    name: 'too-large.jpg',
    mime: 'image/jpeg',
    bytes: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0]),
  }]);
  assert.equal(tooLarge.status, 400);
  assert.match((await tooLarge.json()).message, /size limit/);

  const tooMany = await sendFiles(url, samples.slice(0, 2));
  assert.equal(tooMany.status, 400);
  assert.match((await tooMany.json()).message, /file-count limit/);
});

test('signature validation identifies actual bytes, not claimed MIME values', () => {
  for (const sample of samples) {
    const detected = sniffMediaType(sample.bytes);
    assert.equal(detected.mimeType, sample.mime);
    assert.equal(validateMediaFile(sample.name, sample.mime, sample.bytes), true);
    assert.equal(validateMediaFile(sample.name, 'application/octet-stream', sample.bytes), false);
  }
  assert.equal(SUPPORTED_MEDIA_TYPES.some((type) => type.extensions.includes('.svg')), false);
});

test('admin upload route requires authentication before Multer processes files', async () => {
  const routes = await fs.readFile(path.join(__dirname, '../src/routes/adminRoutes.ts'), 'utf8');
  assert.ok(routes.indexOf('router.use(requireAuth)') < routes.indexOf("router.post('/media/upload'"));
  assert.match(routes, /upload\.array\('files', 15\), validateUploadedFiles, uploadMedia/);
});
