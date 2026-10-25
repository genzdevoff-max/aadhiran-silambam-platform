// b2-test-upload.cjs
// script to verify Backblaze B2 configuration and upload/download/delete a test PNG
// No secrets are printed. Missing env vars cause early exit.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const requiredVars = ['B2_ENDPOINT', 'B2_REGION', 'B2_BUCKET_NAME', 'B2_APPLICATION_KEY_ID', 'B2_APPLICATION_KEY'];
const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length) {
  console.error('Missing required B2 environment variables:', missing.join(', '));
  process.exit(1);
}

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
// Resolve compiled module if available, otherwise build backend then load it
const compiledPath = path.join(__dirname, '..', 'dist', 'services', 'b2Storage.js');
let storageModule;
if (fs.existsSync(compiledPath)) {
  storageModule = require(compiledPath);
} else {
  // Attempt to build the backend first
  try {
    const cp = require('child_process');
    cp.execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'ignore' });
    if (fs.existsSync(compiledPath)) {
      storageModule = require(compiledPath);
    } else {
      console.error('Compiled b2Storage.js not found after build.');
      process.exit(1);
    }
  } catch (e) {
    console.error('Failed to build backend before loading b2Storage:', e.message);
    process.exit(1);
  }
}
const { uploadToB2, deleteFromB2, getUrlForKey } = storageModule;

// minimal 1x1 transparent PNG (base64)
const pngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwMB/6X6nJkAAAAASUVORK5CYII=';
const pngBuffer = Buffer.from(pngBase64, 'base64');

async function writeTempFile() {
  const tmpName = path.join(os.tmpdir(), `b2-test-${crypto.randomUUID()}.png`);
  await fs.promises.writeFile(tmpName, pngBuffer);
  return tmpName;
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const data = Buffer.concat(chunks);
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', err => reject(err));
  });
}

(async () => {
  try {
    const tmpPath = await writeTempFile();
    const file = {
      path: tmpPath,
      originalname: 'test.png',
      mimetype: 'image/png'
    };
    const { key, url } = await uploadToB2(file, true);
    console.log('Upload succeeded. Key:', key);
    // Verify download
    const getResult = await httpGet(url);
    if (getResult.status !== 200) {
      throw new Error(`GET after upload returned status ${getResult.status}`);
    }
    if (!getResult.body.equals(pngBuffer)) {
      throw new Error('Downloaded content does not match uploaded PNG');
    }
    console.log('Download verification passed. MIME:', getResult.headers['content-type'] || getResult.headers['Content-Type']);
    // Delete object
    await deleteFromB2(key);
    console.log('Delete request sent.');
    // Verify deletion (expect 404)
    try {
      const afterDel = await httpGet(url);
      if (afterDel.status === 200) {
        throw new Error('Object still accessible after deletion');
      }
      console.log('Deletion verified (status', afterDel.status, ').');
    } catch (e) {
      console.log('Deletion verification completed (expected error).');
    }
    console.log('✅ B2 upload test passed');
    process.exit(0);
  }  catch (err) {
    console.error("B2 upload test failed:", {
      name: err.name,
      message: err.message,
      code: err.Code || err.code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId,
    });

    console.error(err.stack);
    process.exit(1);
  }
})();
