import HealthRecord from '../models/HealthRecord.js';
import path from 'path';
import fs from 'fs';

// Get health records for a user
export const getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new health record
export const addHealthRecord = async (req, res) => {
  try {
    const { recordType, date, doctorName, hospitalName, details } = req.body;

    const attachments = req.files?.map(file => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      contentType: file.mimetype
    })) || [];

    const record = new HealthRecord({
      user: req.user._id,
      recordType,
      date,
      doctorName,
      hospitalName,
      details: details || '',
      attachments
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Delete associated files from disk
    record.attachments.forEach(att => {
      const filePath = path.join(process.cwd(), 'uploads', att.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch { /* ignore */ }
      }
    });

    await record.deleteOne();
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
