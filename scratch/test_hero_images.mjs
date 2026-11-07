import fs from 'fs';
import path from 'path';

const keys = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '7.jpg',
  '8.jpg',
  'b417be8b-6b26-4914-848f-fdc546a2abd2.jpg',
  '30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg',
  '55f38e6f-21d5-4a62-a178-d3921baa25fd.jpg',
  'cde7d1f2-37ec-4367-9130-16a957c6bb2e.jpg',
  'a72ec070-df9c-4566-affb-94b54dd51b14.jpg',
  'silambam-back.jpg',
  'services.png'
];

console.log('Checking local uploads and cache:');
keys.forEach(k => {
  const p1 = path.resolve('backend/uploads', k);
  const p2 = path.resolve('backend/uploads/b2_cache', k);
  const p3 = path.resolve('frontend/public/uploads', k);
  console.log(k, {
    inBackendUploads: fs.existsSync(p1),
    inB2Cache: fs.existsSync(p2),
    inFrontendPublic: fs.existsSync(p3)
  });
});
