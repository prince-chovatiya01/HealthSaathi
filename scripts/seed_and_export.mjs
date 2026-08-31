/**
 * HealthSaathi Demo Seed + Excel Export
 * Creates rich demo accounts and exports HealthSaathi_Demo_Credentials.xlsx
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Models ────────────────────────────────────────────────────────────────
import User from '../server/models/User.js';
import Doctor from '../server/models/Doctor.js';
import Appointment from '../server/models/Appointment.js';
import Rating from '../server/models/Rating.js';
import HealthRecord from '../server/models/HealthRecord.js';
import Chat from '../server/models/Chat.js';

const URI = 'mongodb+srv://root:root@completecoding.bft5dmj.mongodb.net/healthsaathi?appName=CompleteCoding';

// ─── Helper ────────────────────────────────────────────────────────────────
async function upsertUser({ phoneNumber, name, password, role }) {
  let u = await User.findOne({ phoneNumber });
  if (!u) {
    u = await User.create({ name, phoneNumber, password, role });
    console.log(`  ✅ Created ${role}: ${name} (${phoneNumber})`);
  } else {
    console.log(`  ℹ️  Exists  ${role}: ${name} (${phoneNumber})`);
  }
  return u;
}

async function upsertDoctor(data) {
  let d = await Doctor.findOne({ name: data.name });
  if (!d) {
    d = await Doctor.create(data);
    console.log(`  ✅ Created Doctor: ${data.name}`);
  } else {
    console.log(`  ℹ️  Exists  Doctor: ${data.name}`);
  }
  return d;
}

async function upsertAppointment({ userId, doctorId, date, time, status, notes }) {
  let a = await Appointment.findOne({ userId, doctorId, date, time });
  if (!a) {
    a = await Appointment.create({ userId, doctorId, date, time, status, notes });
    console.log(`    📅 Appointment created: ${date} ${time} [${status}]`);
  }
  return a;
}

async function upsertRating({ user, doctor, appointment, rating, review }) {
  let r = await Rating.findOne({ user, doctor, appointment });
  if (!r) {
    r = await Rating.create({ user, doctor, appointment, rating, review });
    console.log(`    ⭐ Rating created: ${rating}/5`);
  }
  return r;
}

async function upsertHealthRecord({ user, recordType, date, doctorName, hospitalName, details }) {
  let r = await HealthRecord.findOne({ user, recordType, date });
  if (!r) {
    r = await HealthRecord.create({ user, recordType, date, doctorName, hospitalName, details });
    console.log(`    📄 Health record created: ${recordType}`);
  }
  return r;
}

// ─── Seed ──────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n📦 Seeding demo data...\n');

  // ── Admins
  const admin1 = await upsertUser({ name: 'Demo Admin', phoneNumber: '9000000001', password: 'Admin@123', role: 'admin' });

  // ── Patients / Users
  const patient1 = await upsertUser({ name: 'Arjun Sharma',   phoneNumber: '9111111111', password: 'Patient@1', role: 'user' });
  const patient2 = await upsertUser({ name: 'Priya Patel',    phoneNumber: '9222222222', password: 'Patient@2', role: 'user' });
  const patient3 = await upsertUser({ name: 'Ravi Kumar',     phoneNumber: '9333333333', password: 'Patient@3', role: 'user' });
  const patient4 = await upsertUser({ name: 'Meena Desai',    phoneNumber: '9444444444', password: 'Patient@4', role: 'user' });

  // ── Doctors
  const slotFull = [
    { day: 'Monday',    slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '18:00' }] },
    { day: 'Tuesday',   slots: [{ startTime: '09:00', endTime: '13:00' }] },
    { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '18:00' }] },
    { day: 'Thursday',  slots: [{ startTime: '09:00', endTime: '13:00' }] },
    { day: 'Friday',    slots: [{ startTime: '09:00', endTime: '12:00' }] },
    { day: 'Saturday',  slots: [{ startTime: '10:00', endTime: '14:00' }] },
  ];

  const doc1 = await upsertDoctor({
    name: 'Dr. Anil Mehta', specialization: 'Cardiology', experience: 15,
    languages: ['English', 'Hindi', 'Gujarati'], fees: 600,
    availability: slotFull,
    imageUrl: 'https://ui-avatars.com/api/?name=Anil+Mehta&background=0D8ABC&color=fff&rounded=true'
  });

  const doc2 = await upsertDoctor({
    name: 'Dr. Sunita Rao', specialization: 'Dermatology', experience: 10,
    languages: ['English', 'Hindi', 'Telugu'], fees: 500,
    availability: [
      { day: 'Monday',    slots: [{ startTime: '10:00', endTime: '14:00' }] },
      { day: 'Wednesday', slots: [{ startTime: '10:00', endTime: '14:00' }] },
      { day: 'Friday',    slots: [{ startTime: '10:00', endTime: '13:00' }] },
    ],
    imageUrl: 'https://ui-avatars.com/api/?name=Sunita+Rao&background=6D28D9&color=fff&rounded=true'
  });

  const doc3 = await upsertDoctor({
    name: 'Dr. Ramesh Nair', specialization: 'Pediatrics', experience: 12,
    languages: ['English', 'Hindi', 'Malayalam'], fees: 450,
    availability: [
      { day: 'Tuesday',  slots: [{ startTime: '09:00', endTime: '17:00' }] },
      { day: 'Thursday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
      { day: 'Saturday', slots: [{ startTime: '09:00', endTime: '13:00' }] },
    ],
    imageUrl: 'https://ui-avatars.com/api/?name=Ramesh+Nair&background=059669&color=fff&rounded=true'
  });

  const doc4 = await upsertDoctor({
    name: 'Dr. Kavita Joshi', specialization: 'Neurology', experience: 18,
    languages: ['English', 'Hindi', 'Marathi'], fees: 900,
    availability: [
      { day: 'Monday',  slots: [{ startTime: '11:00', endTime: '15:00' }] },
      { day: 'Friday',  slots: [{ startTime: '11:00', endTime: '15:00' }] },
    ],
    imageUrl: 'https://ui-avatars.com/api/?name=Kavita+Joshi&background=DC2626&color=fff&rounded=true'
  });

  // ── Appointments for patient1 (Arjun) — has completed + upcoming + cancelled
  console.log('\n  📅 Arjun Sharma appointments...');
  const apt1_completed = await upsertAppointment({ userId: patient1._id, doctorId: doc1._id, date: '2025-11-15', time: '09:00', status: 'completed', notes: 'Chest pain follow-up' });
  const apt1_completed2 = await upsertAppointment({ userId: patient1._id, doctorId: doc2._id, date: '2025-12-05', time: '10:00', status: 'completed', notes: 'Skin allergy checkup' });
  const apt1_upcoming = await upsertAppointment({ userId: patient1._id, doctorId: doc1._id, date: '2026-09-10', time: '11:00', status: 'upcoming', notes: 'Annual cardiac review' });
  const apt1_cancelled = await upsertAppointment({ userId: patient1._id, doctorId: doc3._id, date: '2025-10-20', time: '09:00', status: 'cancelled', notes: '' });

  // ── Ratings from patient1
  console.log('  ⭐ Arjun ratings...');
  await upsertRating({ user: patient1._id, doctor: doc1._id, appointment: apt1_completed._id, rating: 5, review: 'Dr. Mehta is exceptional! Very thorough and caring.' });
  await upsertRating({ user: patient1._id, doctor: doc2._id, appointment: apt1_completed2._id, rating: 4, review: 'Great experience with Dr. Rao. Highly recommend.' });

  // ── Health records for patient1
  console.log('  📄 Arjun health records...');
  await upsertHealthRecord({ user: patient1._id, recordType: 'Lab Report', date: new Date('2025-11-14'), doctorName: 'Dr. Anil Mehta', hospitalName: 'City Heart Clinic', details: 'CBC and lipid panel. Cholesterol slightly elevated at 210 mg/dL.' });
  await upsertHealthRecord({ user: patient1._id, recordType: 'Prescription', date: new Date('2025-11-15'), doctorName: 'Dr. Anil Mehta', hospitalName: 'City Heart Clinic', details: 'Atorvastatin 10mg once daily. Follow-up in 3 months.' });
  await upsertHealthRecord({ user: patient1._id, recordType: 'X-Ray', date: new Date('2025-12-01'), doctorName: 'Dr. Sunita Rao', hospitalName: 'Wellness Skin Center', details: 'Chest X-ray clear. No abnormalities detected.' });

  // ── Health metrics for patient1
  patient1.healthMetrics = { heartRate: 78, bloodPressure: '125/82', weight: 74, temperature: 98.4, steps: 7500, lastUpdated: new Date().toISOString() };
  await patient1.save();
  console.log('  💓 Arjun health metrics set');

  // ── Appointments for patient2 (Priya) — upcoming only, no rating yet
  console.log('\n  📅 Priya Patel appointments...');
  const apt2_upcoming = await upsertAppointment({ userId: patient2._id, doctorId: doc2._id, date: '2026-09-15', time: '10:00', status: 'upcoming', notes: 'Hair loss and scalp issues' });
  const apt2_completed = await upsertAppointment({ userId: patient2._id, doctorId: doc3._id, date: '2025-10-10', time: '09:00', status: 'completed', notes: 'Child fever follow-up' });

  // ── Health records for patient2
  console.log('  📄 Priya health records...');
  await upsertHealthRecord({ user: patient2._id, recordType: 'Blood Test', date: new Date('2025-10-08'), doctorName: 'Dr. Ramesh Nair', hospitalName: 'Family Care Hospital', details: 'Hemoglobin 11.2 g/dL, slight anaemia detected. Iron supplements advised.' });

  // ── Appointments for patient3 (Ravi) — one completed with no rating (ideal demo for rating flow)
  console.log('\n  📅 Ravi Kumar appointments...');
  const apt3_completed = await upsertAppointment({ userId: patient3._id, doctorId: doc4._id, date: '2025-12-20', time: '11:00', status: 'completed', notes: 'Migraine diagnosis and follow-up' });
  const apt3_upcoming = await upsertAppointment({ userId: patient3._id, doctorId: doc1._id, date: '2026-09-20', time: '14:00', status: 'upcoming', notes: 'Heart check after family history' });

  // ── Health metrics for patient3
  patient3.healthMetrics = { heartRate: 88, bloodPressure: '135/90', weight: 82, temperature: 99.1, steps: 4200, lastUpdated: new Date().toISOString() };
  await patient3.save();
  console.log('  💓 Ravi health metrics set');

  // ── patient4 (Meena) — fresh account, no appointments, perfect for booking demo
  console.log('\n  ℹ️  Meena Desai: fresh account for booking demo');

  // ── Chat messages from patient1 to doc1
  console.log('\n  💬 Seeding chat messages...');
  const chatExists = await Chat.findOne({ sender: patient1._id });
  if (!chatExists) {
    await Chat.create({ sender: patient1._id, receiver: doc1._id, message: 'Hello Dr. Mehta, I have a question about my medication.' });
    await Chat.create({ sender: doc1._id, receiver: patient1._id, message: 'Hello Arjun, please continue Atorvastatin as prescribed and avoid fatty foods.' });
    await Chat.create({ sender: patient1._id, receiver: doc1._id, message: 'Thank you Doctor. Should I get another blood test next month?' });
    console.log('    💬 Chat messages created');
  }

  console.log('\n✅ Seeding complete!\n');
  return { admin1, patient1, patient2, patient3, patient4, doc1, doc2, doc3, doc4, apt1_completed, apt1_upcoming, apt2_upcoming, apt2_completed, apt3_completed, apt3_upcoming };
}

// ─── Excel Export ──────────────────────────────────────────────────────────
function styleHeader(ws, range) {
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[addr]) continue;
    ws[addr].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
      fill: { patternType: 'solid', fgColor: { rgb: '1E40AF' } },
      alignment: { wrapText: true, vertical: 'center' }
    };
  }
}

function buildSheet(data, cols) {
  const ws = XLSX.utils.json_to_sheet(data, { header: cols.map(c => c.key) });
  // Rename headers
  cols.forEach((c, i) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c: i });
    ws[addr] = { v: c.label, t: 's' };
  });
  ws['!cols'] = cols.map(c => ({ wch: c.w || 20 }));
  const range = XLSX.utils.decode_range(ws['!ref']);
  styleHeader(ws, range);
  return ws;
}

async function generateExcel(data) {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Users / Patients ─────────────────────────────────────────
  const userRows = [
    {
      name: 'Arjun Sharma', phone: '9111111111', password: 'Patient@1', role: 'user',
      description: 'POWER USER — has completed + upcoming + cancelled appointments, 2 ratings submitted, 3 health records, health metrics, and chat history. Best account for full feature demo.',
      demo_data: '2 completed appts (Dr. Mehta & Dr. Rao) | 1 upcoming appt | 1 cancelled | 2 ratings (5★ + 4★) | 3 health records | health metrics set | chat with Dr. Mehta'
    },
    {
      name: 'Priya Patel', phone: '9222222222', password: 'Patient@2', role: 'user',
      description: 'Has 1 upcoming appointment (Dr. Rao) and 1 completed appointment (Dr. Ramesh, not yet rated). Good for demonstrating the "Rate Doctor" button on completed appointments.',
      demo_data: '1 upcoming appt (Dr. Rao, Sep 15 2026) | 1 completed appt (Dr. Nair) | 0 ratings — rate-doctor flow demo | 1 health record'
    },
    {
      name: 'Ravi Kumar', phone: '9333333333', password: 'Patient@3', role: 'user',
      description: 'Has 1 completed appointment with Dr. Kavita Joshi (Neurology) that has NOT been rated yet — ideal for demonstrating the rating submission flow. Also has health metrics.',
      demo_data: '1 completed unrated appt (Dr. Joshi, Neurology) | 1 upcoming appt (Dr. Mehta) | health metrics set | best for live rating demo'
    },
    {
      name: 'Meena Desai', phone: '9444444444', password: 'Patient@4', role: 'user',
      description: 'Fresh / clean account with zero history. Ideal for demonstrating the complete new-user flow: search doctors → book appointment → view upcoming appointments.',
      demo_data: 'No appointments | No records | No metrics — perfect for live booking demo'
    },
  ];
  const userCols = [
    { key: 'name',        label: 'Name',             w: 18 },
    { key: 'phone',       label: 'Phone (Login ID)', w: 18 },
    { key: 'password',    label: 'Password',          w: 14 },
    { key: 'role',        label: 'Role',              w: 10 },
    { key: 'description', label: 'Demo Purpose',      w: 55 },
    { key: 'demo_data',   label: 'Existing Demo Data', w: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, buildSheet(userRows, userCols), '1. Patients');

  // ── Sheet 2: Admins ───────────────────────────────────────────────────
  const adminRows = [
    {
      name: 'Demo Admin', phone: '9000000001', password: 'Admin@123', role: 'admin',
      description: 'Full admin account. Can manage all doctors (add/edit/delete), view all appointments across all users, and change appointment status to completed or cancelled.',
      features: '/admin/doctors — Add Dr., Edit Dr., Delete Dr. | /admin/manage-appointments — Mark appointments Completed/Cancelled'
    },
    {
      name: 'Admin (original)', phone: '9999999999', password: 'admin1234', role: 'admin',
      description: 'Original seeded admin account created during initial setup.',
      features: 'Same admin capabilities as above'
    },
  ];
  const adminCols = [
    { key: 'name',        label: 'Name',             w: 20 },
    { key: 'phone',       label: 'Phone (Login ID)', w: 18 },
    { key: 'password',    label: 'Password',          w: 14 },
    { key: 'role',        label: 'Role',              w: 10 },
    { key: 'description', label: 'Demo Purpose',      w: 50 },
    { key: 'features',    label: 'Admin Features',    w: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, buildSheet(adminRows, adminCols), '2. Admins');

  // ── Sheet 3: Doctors ──────────────────────────────────────────────────
  const doctorRows = [
    {
      name: 'Dr. Anil Mehta', specialty: 'Cardiology', experience: '15 years', fees: '₹600', languages: 'English, Hindi, Gujarati',
      login: 'N/A — Doctors do not have login accounts in this application', 
      demo: 'Most data-rich doctor: has 2 completed appointments, 2 ratings (avg 5★ & 4★), chat history. Use for demonstrating doctor detail page, star ratings, and reviews.'
    },
    {
      name: 'Dr. Sunita Rao', specialty: 'Dermatology', experience: '10 years', fees: '₹500', languages: 'English, Hindi, Telugu',
      login: 'N/A',
      demo: 'Has 1 completed appointment with 4★ rating from Arjun. Good for specialty filter demo (filter Dermatology).'
    },
    {
      name: 'Dr. Ramesh Nair', specialty: 'Pediatrics', experience: '12 years', fees: '₹450', languages: 'English, Hindi, Malayalam',
      login: 'N/A',
      demo: 'Has completed appointment with Priya (not yet rated). Use for demonstrating "Rate Doctor" flow after login as Priya Patel.'
    },
    {
      name: 'Dr. Kavita Joshi', specialty: 'Neurology', experience: '18 years', fees: '₹900', languages: 'English, Hindi, Marathi',
      login: 'N/A',
      demo: 'Has 1 completed appointment with Ravi Kumar that has NO rating yet. Best doctor for live rating demo — login as Ravi, go to /rate-doctor.'
    },
    {
      name: 'Dr. Test Cardiologist', specialty: 'Cardiology', experience: '10 years', fees: '₹500', languages: 'English, Hindi',
      login: 'N/A',
      demo: 'Original seeded test doctor. Has completed and upcoming appointments with test users.'
    },
    {
      name: 'Dr. Jane Smith', specialty: 'Dermatology', experience: '8 years', fees: '₹800', languages: 'English',
      login: 'N/A',
      demo: 'Secondary seeded doctor for dermatology specialty filter demonstration.'
    },
  ];
  const docCols = [
    { key: 'name',       label: 'Doctor Name',   w: 25 },
    { key: 'specialty',  label: 'Specialization', w: 16 },
    { key: 'experience', label: 'Experience',     w: 13 },
    { key: 'fees',       label: 'Fees',           w: 10 },
    { key: 'languages',  label: 'Languages',      w: 28 },
    { key: 'login',      label: 'Login Creds',    w: 30 },
    { key: 'demo',       label: 'Demo Purpose',   w: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, buildSheet(doctorRows, docCols), '3. Doctors');

  // ── Sheet 4: Demo Scenarios ───────────────────────────────────────────
  const scenarioRows = [
    {
      num: 1, scenario: 'Sign Up (new user)',
      login_as: 'New account (use any unused phone number)',
      path: '/signup',
      steps: '1. Open /signup  2. Enter name, phone, password  3. Click Sign Up  4. Auto-redirects to /dashboard',
      expected: 'Account created, token stored, redirected to Dashboard'
    },
    {
      num: 2, scenario: 'Login',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/login',
      steps: '1. Enter phone: 9111111111  2. Enter password: Patient@1  3. Click Login',
      expected: 'Redirected to Dashboard with user name shown'
    },
    {
      num: 3, scenario: 'Dashboard — Health Metrics',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/dashboard',
      steps: '1. Login as Arjun  2. Dashboard shows heart rate, BP, weight, steps  3. Click Edit to update a metric  4. Save',
      expected: 'Real metrics from DB displayed; update saved to Atlas'
    },
    {
      num: 4, scenario: 'Dashboard — Upcoming Appointments widget',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/dashboard',
      steps: '1. Login as Arjun  2. Scroll to Appointments section  3. See upcoming appointment with Dr. Mehta (Sep 10)',
      expected: 'Upcoming appointment card shows doctor name, date, time'
    },
    {
      num: 5, scenario: 'Doctor Search & Filter',
      login_as: 'Any logged-in user (e.g. Meena | 9444444444 | Patient@4)',
      path: '/doctors',
      steps: '1. Login  2. Go to /doctors  3. Filter by Specialty = Cardiology  4. Search "Mehta"  5. Filter by availability = Morning',
      expected: '6 doctors listed; filtered to Dr. Anil Mehta when Cardiology selected'
    },
    {
      num: 6, scenario: 'Doctor Detail Page + Reviews',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/doctors/<doctor_id>',
      steps: '1. Go to /doctors  2. Click "Book Now" on Dr. Anil Mehta  3. Will navigate to /doctors/:id detail page  OR go to /book/:id for booking form',
      expected: 'Doctor detail shows name, specialty, fees, availability schedule, 5★ avg rating, reviews from Arjun'
    },
    {
      num: 7, scenario: 'Book Appointment',
      login_as: 'Meena Desai | 9444444444 | Patient@4 (fresh account)',
      path: '/doctors → /book/:id',
      steps: '1. Login as Meena  2. Go to /doctors  3. Click "Book Now" on Dr. Anil Mehta  4. Pick a Monday date  5. Select 09:00-10:00 slot  6. Click Book',
      expected: 'Appointment created, success message shown, appears in /appointments'
    },
    {
      num: 8, scenario: 'View My Appointments (all filters)',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/appointments',
      steps: '1. Login as Arjun  2. Go to /appointments  3. Default "All" shows 4 appointments  4. Click "Completed" filter — shows 2  5. Click "Upcoming" — shows 1  6. Search "Mehta"',
      expected: 'Appointments correctly filtered; status badges colour-coded'
    },
    {
      num: 9, scenario: 'Rate a Completed Appointment',
      login_as: 'Ravi Kumar | 9333333333 | Patient@3',
      path: '/appointments → /rate-doctor',
      steps: '1. Login as Ravi  2. Go to /appointments  3. See completed appointment with Dr. Kavita Joshi  4. Click "Rate Doctor" button  5. Select 5 stars  6. Write review  7. Submit',
      expected: 'Rating saved to DB, doctor\'s avg rating updates immediately on doctor list'
    },
    {
      num: 10, scenario: 'Rate Doctor (dedicated page)',
      login_as: 'Priya Patel | 9222222222 | Patient@2',
      path: '/rate-doctor',
      steps: '1. Login as Priya  2. Go to /rate-doctor  3. See completed appointment with Dr. Nair  4. Click "Rate Doctor"  5. Give 4 stars + review  6. Submit',
      expected: 'Rating modal opens, submits successfully, card shows "Rated ✓"'
    },
    {
      num: 11, scenario: 'Duplicate Rating Prevention',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/rate-doctor',
      steps: '1. Login as Arjun  2. Go to /rate-doctor  3. Both completed appointments show "Rated ✓" with stars  4. Try rating again via API — blocked',
      expected: '"Already rated this appointment" error (400) — no duplicate allowed'
    },
    {
      num: 12, scenario: 'Chat with Doctor',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/dashboard or any chat link',
      steps: '1. Login as Arjun  2. Navigate to chat section  3. See existing conversation with Dr. Mehta  4. Send a new message',
      expected: 'Chat history loads; new message saved via REST + real-time Socket.IO'
    },
    {
      num: 13, scenario: 'Health Records — View',
      login_as: 'Arjun Sharma | 9111111111 | Patient@1',
      path: '/health-records',
      steps: '1. Login as Arjun  2. Go to /health-records  3. See 3 records: Lab Report, Prescription, X-Ray  4. Click expand arrow to see details',
      expected: '3 health records shown with type badge, date, doctor, hospital, details'
    },
    {
      num: 14, scenario: 'Health Record Upload',
      login_as: 'Meena Desai | 9444444444 | Patient@4',
      path: '/health-records',
      steps: '1. Login as Meena  2. Go to /health-records  3. Click "Upload Record"  4. Fill form: type=Prescription, date, doctor name  5. Attach a PDF/image  6. Submit',
      expected: 'Record saved to MongoDB; file stored in /uploads/; record appears in list'
    },
    {
      num: 15, scenario: 'Health Metrics Update',
      login_as: 'Meena Desai | 9444444444 | Patient@4',
      path: '/dashboard',
      steps: '1. Login as Meena (no metrics yet)  2. Dashboard shows "No metrics" empty state  3. Click "Add Metrics"  4. Enter heart rate, BP, weight etc  5. Save',
      expected: 'Metrics saved to Atlas; dashboard widgets populated immediately'
    },
    {
      num: 16, scenario: 'Profile — Edit Name',
      login_as: 'Any user (e.g. Arjun | 9111111111 | Patient@1)',
      path: '/profile',
      steps: '1. Login  2. Go to /profile  3. See name, phone, role, appointment counts  4. Click edit icon  5. Change name  6. Save',
      expected: 'Name updated in DB and context; shown immediately across app'
    },
    {
      num: 17, scenario: 'Medicines Page',
      login_as: 'Any logged-in user',
      path: '/medicines',
      steps: '1. Login  2. Go to /medicines  3. Browse/search medicines  4. Add to cart  5. Place order',
      expected: 'Frontend-only feature (static demo data) — showcases UI'
    },
    {
      num: 18, scenario: 'Wellness Page',
      login_as: 'Any logged-in user',
      path: '/wellness',
      steps: '1. Login  2. Go to /wellness  3. Browse wellness tips and exercises',
      expected: 'Frontend-only feature — showcases wellness content UI'
    },
    {
      num: 19, scenario: 'Admin — Manage Doctors',
      login_as: 'Demo Admin | 9000000001 | Admin@123',
      path: '/admin/doctors',
      steps: '1. Login as Admin  2. Go to /admin/doctors  3. See all 6 doctors  4. Click "Add Doctor" — fill form  5. Edit existing doctor  6. Delete a test doctor',
      expected: 'Doctor CRUD operations; changes reflected immediately on /doctors page'
    },
    {
      num: 20, scenario: 'Admin — Manage Appointments',
      login_as: 'Demo Admin | 9000000001 | Admin@123',
      path: '/admin/manage-appointments',
      steps: '1. Login as Admin  2. Go to /admin/manage-appointments  3. See all appointments from all users  4. Select "Completed" for an upcoming appointment  5. Apply Changes',
      expected: 'Appointment status updated; patient can now rate the doctor'
    },
    {
      num: 21, scenario: 'Admin — Add Doctor (full flow)',
      login_as: 'Demo Admin | 9000000001 | Admin@123',
      path: '/admin/add-doctor',
      steps: '1. Login as Admin  2. Go to /admin/add-doctor  3. Fill: name, specialty, experience, fees, languages, availability slots  4. Submit',
      expected: 'New doctor created in DB; appears in /doctors list for all users'
    },
    {
      num: 22, scenario: 'Conflict Prevention — Double Booking',
      login_as: 'Any user',
      path: '/book/:id',
      steps: '1. Login  2. Book a slot with Dr. Mehta on any date/time  3. Try booking same date+time again',
      expected: '"This time slot is already booked" (409) error shown'
    },
  ];
  const scenarioCols = [
    { key: 'num',        label: '#',              w: 4  },
    { key: 'scenario',   label: 'Scenario',        w: 30 },
    { key: 'login_as',   label: 'Login As',        w: 35 },
    { key: 'path',       label: 'Page / Path',     w: 22 },
    { key: 'steps',      label: 'Steps',           w: 65 },
    { key: 'expected',   label: 'Expected Result', w: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, buildSheet(scenarioRows, scenarioCols), '4. Demo Scenarios');

  // ── Sheet 5: Quick Reference ──────────────────────────────────────────
  const qrRows = [
    { item: '🌐 Frontend URL',       value: 'http://localhost:5173' },
    { item: '🖥️  Backend API URL',    value: 'http://localhost:3000/api' },
    { item: '🔌 Socket.IO',           value: 'http://localhost:3000 (auto-connected)' },
    { item: '🗄️  MongoDB',            value: 'Atlas — completecoding.bft5dmj.mongodb.net / healthsaathi' },
    { item: '',                        value: '' },
    { item: '👤 Admin Login',         value: 'Phone: 9000000001 | Password: Admin@123' },
    { item: '👥 Demo Patient 1',      value: 'Phone: 9111111111 | Password: Patient@1  (Arjun Sharma — full data)' },
    { item: '👥 Demo Patient 2',      value: 'Phone: 9222222222 | Password: Patient@2  (Priya Patel — upcoming + unrated)' },
    { item: '👥 Demo Patient 3',      value: 'Phone: 9333333333 | Password: Patient@3  (Ravi Kumar — unrated completed appt)' },
    { item: '👥 Demo Patient 4',      value: 'Phone: 9444444444 | Password: Patient@4  (Meena Desai — fresh, for booking demo)' },
    { item: '',                        value: '' },
    { item: '⚕️  Doctors (no login)', value: 'Dr. Anil Mehta (Cardiology ₹600) | Dr. Sunita Rao (Dermatology ₹500)' },
    { item: '',                        value: 'Dr. Ramesh Nair (Pediatrics ₹450) | Dr. Kavita Joshi (Neurology ₹900)' },
    { item: '',                        value: '' },
    { item: '🏆 Best Demo Flow',      value: '1. Admin adds doctor → 2. Meena books appt → 3. Admin marks completed → 4. Ravi rates Dr. Joshi' },
    { item: '📌 Note',               value: 'Doctors do NOT have login accounts — doctor management is admin-only.' },
    { item: '📌 Note',               value: 'Medicines & Wellness pages are frontend-only (no backend DB).' },
    { item: '📌 Note',               value: 'Symptom Checker requires an AI API key (VITE_AI_API_KEY in .env).' },
  ];
  const qrCols = [
    { key: 'item',  label: 'Item',  w: 28 },
    { key: 'value', label: 'Value', w: 80 },
  ];
  XLSX.utils.book_append_sheet(wb, buildSheet(qrRows, qrCols), '5. Quick Reference');

  // Write file
  const outPath = path.join(ROOT, 'HealthSaathi_Demo_Credentials.xlsx');
  XLSX.writeFile(wb, outPath);
  console.log(`\n📊 Excel written to: ${outPath}\n`);
}

// ─── Main ──────────────────────────────────────────────────────────────────
await mongoose.connect(URI);
console.log('✅ MongoDB Connected\n');
const refs = await seed();
await generateExcel(refs);
await mongoose.disconnect();
console.log('Done ✅');
