// Fix existing health records that have no attachments — add PDF files to them
import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'uploads');

const URI = process.env.MONGODB_URI;

function makePDF(title, lines) {
  const body = [title, '', ...lines].map(l => `(${l.replace(/[()\\]/g, '\\$&')}) Tj\n0 -16 Td`).join('\n');
  const stream = `BT\n/F1 11 Tf\n50 780 Td\n${body}\nET`;
  const streamBytes = Buffer.byteLength(stream, 'utf8');
  return Buffer.from(`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>>>endobj\n4 0 obj<</Length ${streamBytes}>>\nstream\n${stream}\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000266 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n${270+streamBytes}\n%%EOF`, 'utf8');
}
function makePNG() {
  return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
}

await mongoose.connect(URI);
const HealthRecord = (await import('../server/models/HealthRecord.js')).default;
const User = (await import('../server/models/User.js')).default;

const arjun = await User.findOne({ phoneNumber: '9111111111' });
const records = await HealthRecord.find({ user: arjun._id, 'attachments.0': { $exists: false } });

const fixes = {
  'Lab Report': { fn: 'arjun_lab_cbc_lipid.pdf', content: makePDF('LAB REPORT - CBC & LIPID PANEL', ['Patient: Arjun Sharma', 'Date: 14-Nov-2025', 'Doctor: Dr. Anil Mehta', 'Hospital: City Heart Clinic', '---', 'Cholesterol: 210 mg/dL (Borderline)', 'HDL: 45, LDL: 140, TG: 180', 'Hemoglobin: 14.2 g/dL (Normal)', 'WBC: 7800 /uL (Normal)', '---', 'IMPRESSION: Borderline dyslipidemia.']), mime: 'application/pdf' },
  'Prescription': { fn: 'arjun_prescription_atorva.pdf', content: makePDF('PRESCRIPTION - Dr. Anil Mehta', ['Date: 15-Nov-2025', 'Patient: Arjun Sharma', 'Diagnosis: Borderline Hypercholesterolemia', '---', 'Rx:', '1. Tab Atorvastatin 10mg  1-0-0  x 90 days', '2. Tab Aspirin 75mg       0-1-0  x 30 days', '---', 'Advice: Low-fat diet, 30 min walk daily']), mime: 'application/pdf' },
  'X-Ray': { fn: 'arjun_chest_xray.png', content: makePNG(), mime: 'image/png' },
};

for (const record of records) {
  const fix = fixes[record.recordType];
  if (!fix) continue;
  const storedFilename = `${Date.now()}-${fix.fn}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, storedFilename), fix.content);
  record.attachments = [{ filename: storedFilename, url: `/uploads/${storedFilename}`, contentType: fix.mime }];
  await record.save();
  console.log(`✅ Fixed: ${record.recordType} → ${storedFilename}`);
}

await mongoose.disconnect();
console.log('Done ✅');
