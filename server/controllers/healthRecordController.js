import HealthRecord from '../models/HealthRecord.js';
import path from 'path';

// Get health records for a user
export const getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.userId })
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
      user: req.user.userId,
      recordType,
      date,
      doctorName,
      hospitalName,
      details,
      attachments
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
