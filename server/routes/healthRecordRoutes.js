import express from 'express';
import multer from 'multer';
import path from 'path';
import protect from '../middleware/protect.js';
import { getHealthRecords, addHealthRecord, deleteHealthRecord } from '../controllers/healthRecordController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG'));
    }
  }
});

router.get('/', protect, getHealthRecords);
router.post('/', protect, upload.array('attachments', 5), addHealthRecord);
router.delete('/:id', protect, deleteHealthRecord);

export default router;
