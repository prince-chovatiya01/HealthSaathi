/**
 * Seed mock health records with realistic attached "documents"
 * Creates text-based PDFs (using minimal PDF structure) and PNG placeholders
 * then uploads them via the API so they appear in Health Records for demo patients.
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const URI = 'mongodb+srv://root:root@completecoding.bft5dmj.mongodb.net/healthsaathi?appName=CompleteCoding';

await mongoose.connect(URI);
console.log('✅ MongoDB Connected');

const User = (await import('../server/models/User.js')).default;
const HealthRecord = (await import('../server/models/HealthRecord.js')).default;

// ─── Minimal valid PDF generator ─────────────────────────────────────────────
function makePDF(title, lines) {
  const body = [title, '', ...lines].map(l => `(${l.replace(/[()\\]/g, '\\$&')}) Tj\n0 -16 Td`).join('\n');
  const stream = `BT\n/F1 11 Tf\n50 780 Td\n${body}\nET`;
  const streamBytes = Buffer.byteLength(stream, 'utf8');
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>>>endobj
4 0 obj<</Length ${streamBytes}>>
stream
${stream}
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref
${270 + streamBytes}
%%EOF`;
  return Buffer.from(pdf, 'utf8');
}

// ─── Minimal PNG generator (solid color block) ────────────────────────────────
function makePNG(label) {
  // Minimal 1x1 white PNG — enough to be a valid file that can be downloaded
  // Real xray images would be actual files; for demo we use this placeholder
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(base64, 'base64');
}

// ─── Seed function ────────────────────────────────────────────────────────────
async function seedRecord({ phoneNumber, recordType, date, doctorName, hospitalName, details, filename, content, mime }) {
  const user = await User.findOne({ phoneNumber });
  if (!user) { console.log(`  ⚠️  User ${phoneNumber} not found, skipping`); return; }

  // Check if already exists
  const exists = await HealthRecord.findOne({ user: user._id, recordType, date: new Date(date) });
  if (exists) { console.log(`  ℹ️  Record exists: ${recordType} for ${phoneNumber}`); return; }

  // Write file to uploads/
  const storedFilename = `${Date.now()}-${filename}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, storedFilename), content);

  const record = await HealthRecord.create({
    user: user._id,
    recordType,
    date: new Date(date),
    doctorName,
    hospitalName,
    details,
    attachments: [{ filename: storedFilename, url: `/uploads/${storedFilename}`, contentType: mime }]
  });

  console.log(`  ✅ Created ${recordType} for ${phoneNumber} (${storedFilename})`);
  return record;
}

console.log('\n📋 Seeding health records with mock documents...\n');

// ── Arjun Sharma (9111111111) — Cardiology follow-up records
await seedRecord({
  phoneNumber: '9111111111',
  recordType: 'Lab Report',
  date: '2025-11-14',
  doctorName: 'Dr. Anil Mehta',
  hospitalName: 'City Heart Clinic',
  details: 'CBC, Lipid Panel & Cardiac Enzymes. Cholesterol: 210 mg/dL (borderline high). HDL: 45, LDL: 140. Triglycerides: 180. Recommend dietary changes and follow-up in 3 months.',
  filename: 'lab_report_cbc_lipid.pdf',
  content: makePDF('LAB REPORT - CBC & LIPID PANEL', [
    'Patient: Arjun Sharma', 'Date: 14-Nov-2025', 'Referring Doctor: Dr. Anil Mehta',
    'Hospital: City Heart Clinic', '---',
    'TEST              RESULT       REFERENCE',
    'Cholesterol       210 mg/dL    <200 (Borderline)',
    'HDL               45 mg/dL     >40 (Normal)',
    'LDL               140 mg/dL    <130 (Borderline)',
    'Triglycerides     180 mg/dL    <150 (High)',
    'Hemoglobin        14.2 g/dL    13.5-17.5 (Normal)',
    'WBC               7800 /uL     4000-11000 (Normal)',
    '---',
    'IMPRESSION: Borderline dyslipidemia. Dietary modification advised.',
    'Next review: 3 months.'
  ]),
  mime: 'application/pdf'
});

await seedRecord({
  phoneNumber: '9111111111',
  recordType: 'Prescription',
  date: '2025-11-15',
  doctorName: 'Dr. Anil Mehta',
  hospitalName: 'City Heart Clinic',
  details: 'Atorvastatin 10mg OD, dietary changes recommended. Follow-up in 3 months.',
  filename: 'prescription_atorvastatin.pdf',
  content: makePDF('PRESCRIPTION', [
    'Dr. Anil Mehta, MD (Cardiology)', 'City Heart Clinic, Mumbai',
    'Reg No: MCI-2008-4521', 'Date: 15-Nov-2025',
    '---',
    'Patient: Arjun Sharma    Age: 34    Sex: M',
    'Diagnosis: Borderline Hypercholesterolemia',
    '',
    'Rx:',
    '1. Tab Atorvastatin 10mg  1-0-0  x 90 days',
    '2. Tab Aspirin 75mg       0-1-0  x 30 days (if needed)',
    '',
    'Advice:',
    '- Low-fat, high-fiber diet',
    '- 30 min walk daily',
    '- Avoid alcohol and smoking',
    '- Repeat lipid profile after 3 months',
    '---',
    'Signature: Dr. A. Mehta'
  ]),
  mime: 'application/pdf'
});

await seedRecord({
  phoneNumber: '9111111111',
  recordType: 'X-Ray',
  date: '2025-12-01',
  doctorName: 'Dr. Sunita Rao',
  hospitalName: 'Wellness Skin Center',
  details: 'Chest X-Ray PA view. No active pulmonary disease. Heart size normal. Costophrenic angles clear.',
  filename: 'chest_xray_clear.png',
  content: makePNG('Chest X-Ray'),
  mime: 'image/png'
});

await seedRecord({
  phoneNumber: '9111111111',
  recordType: 'Blood Test',
  date: '2025-09-10',
  doctorName: 'Dr. Anil Mehta',
  hospitalName: 'City Heart Clinic',
  details: 'Fasting blood glucose and HbA1c. Glucose: 98 mg/dL (normal), HbA1c: 5.4% (normal). No diabetes risk detected.',
  filename: 'blood_glucose_hba1c.pdf',
  content: makePDF('BLOOD TEST REPORT - GLUCOSE & HbA1c', [
    'Patient: Arjun Sharma', 'Date: 10-Sep-2025',
    '---',
    'TEST                RESULT     REFERENCE',
    'Fasting Glucose     98 mg/dL   70-100 (Normal)',
    'Post-Prandial       134 mg/dL  <140 (Normal)',
    'HbA1c               5.4%       <5.7 (Normal)',
    '---',
    'IMPRESSION: Normal glycemic control. No diabetic risk.'
  ]),
  mime: 'application/pdf'
});

// ── Priya Patel (9222222222) — Dermatology & Blood records
await seedRecord({
  phoneNumber: '9222222222',
  recordType: 'Blood Test',
  date: '2025-10-08',
  doctorName: 'Dr. Ramesh Nair',
  hospitalName: 'Family Care Hospital',
  details: 'Complete Blood Count. Hemoglobin 11.2 g/dL (low), mild anaemia detected. Iron supplements advised for 3 months.',
  filename: 'priya_cbc_anaemia.pdf',
  content: makePDF('BLOOD TEST REPORT - COMPLETE BLOOD COUNT', [
    'Patient: Priya Patel   Age: 28   Sex: F', 'Date: 08-Oct-2025',
    'Referring Doctor: Dr. Ramesh Nair',
    '---',
    'TEST               RESULT     REFERENCE',
    'Hemoglobin         11.2 g/dL  12.0-15.5 (Low)',
    'RBC                3.8 M/uL   4.2-5.4 (Low)',
    'WBC                7200 /uL   4000-11000 (Normal)',
    'Platelets          240000 /uL 150000-400000 (Normal)',
    'MCV                74 fL      80-100 (Low - Iron Def)',
    'Serum Ferritin     8 ng/mL    12-150 (Low)',
    '---',
    'IMPRESSION: Iron-deficiency anaemia. Start iron supplementation.',
    'Retest after 3 months of treatment.'
  ]),
  mime: 'application/pdf'
});

await seedRecord({
  phoneNumber: '9222222222',
  recordType: 'Prescription',
  date: '2025-10-10',
  doctorName: 'Dr. Ramesh Nair',
  hospitalName: 'Family Care Hospital',
  details: 'Iron supplementation prescribed for anaemia. Ferrous sulfate 200mg twice daily with Vitamin C.',
  filename: 'priya_iron_prescription.pdf',
  content: makePDF('PRESCRIPTION - IRON SUPPLEMENT', [
    'Dr. Ramesh Nair, MD (Pediatrics & General Medicine)',
    'Family Care Hospital, Pune', 'Date: 10-Oct-2025',
    '---',
    'Patient: Priya Patel   Age: 28   Diagnosis: Iron Deficiency Anaemia',
    '',
    'Rx:',
    '1. Tab Ferrous Sulfate 200mg  1-0-1  x 90 days (with food)',
    '2. Tab Vitamin C 500mg        1-0-0  x 90 days',
    '3. Tab Folic Acid 5mg         1-0-0  x 30 days',
    '',
    'Advice:',
    '- Take iron tablets with orange juice or water',
    '- Avoid tea/coffee for 1 hour before/after iron tablet',
    '- Include green leafy vegetables, red meat, legumes in diet',
    '- Stool may appear dark/black - this is normal',
    '---',
    'Signature: Dr. R. Nair'
  ]),
  mime: 'application/pdf'
});

// ── Ravi Kumar (9333333333) — Neurology consultation
await seedRecord({
  phoneNumber: '9333333333',
  recordType: 'Prescription',
  date: '2025-12-20',
  doctorName: 'Dr. Kavita Joshi',
  hospitalName: 'BrainCare Neurology Center',
  details: 'Migraine with aura. Sumatriptan 50mg for acute attacks, Propranolol 40mg for prophylaxis. Lifestyle modification advised.',
  filename: 'ravi_migraine_prescription.pdf',
  content: makePDF('PRESCRIPTION - MIGRAINE MANAGEMENT', [
    'Dr. Kavita Joshi, DM (Neurology)',
    'BrainCare Neurology Center, Delhi', 'Date: 20-Dec-2025',
    'Reg No: DCI-2006-8834',
    '---',
    'Patient: Ravi Kumar   Age: 31   Sex: M',
    'Diagnosis: Migraine with Aura (Chronic)',
    'Frequency: 3-4 episodes/month',
    '',
    'Rx:',
    '1. Tab Sumatriptan 50mg   - On attack onset, repeat after 2h if needed',
    '   Max: 2 tablets/attack, 4 tablets/week',
    '2. Tab Propranolol 40mg   1-0-1  x 60 days (prophylaxis)',
    '3. Tab Domperidone 10mg   - With each sumatriptan dose',
    '',
    'Advice:',
    '- Maintain migraine diary (triggers, duration, severity)',
    '- Regular sleep schedule 7-8 hours',
    '- Avoid bright/flickering lights, strong odors',
    '- Limit caffeine to 1 cup/day',
    '- Stay hydrated, avoid skipping meals',
    'Follow-up: 6 weeks',
    '---',
    'Signature: Dr. K. Joshi'
  ]),
  mime: 'application/pdf'
});

await seedRecord({
  phoneNumber: '9333333333',
  recordType: 'MRI',
  date: '2025-12-18',
  doctorName: 'Dr. Kavita Joshi',
  hospitalName: 'BrainCare Neurology Center',
  details: 'MRI Brain plain and contrast. No intracranial mass, hemorrhage, or significant white matter changes. Findings consistent with migraine.',
  filename: 'ravi_mri_brain.png',
  content: makePNG('MRI Brain'),
  mime: 'image/png'
});

await mongoose.disconnect();
console.log('\n✅ Mock health documents seeded successfully!\n');
