import express from 'express';
import multer from 'multer';
import path from 'path';
import protect from '../middleware/protect.js';
import { getHealthRecords, addHealthRecord } from '../controllers/healthRecordController.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Routes
router.get('/', auth, getHealthRecords);
router.post('/', auth, upload.array('attachments', 5), addHealthRecord);

export default router;
