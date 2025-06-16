import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { healthRecords } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE_MB = 5;

const HealthRecordUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [recordType, setRecordType] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Optional: filter out duplicates by name and size
      const filteredNewFiles = newFiles.filter((newFile) => {
        return !files.some(
          (file) => file.name === newFile.name && file.size === newFile.size
        );
      });

      // Optional: filter files by max size
      const validFiles = filteredNewFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
          return false;
        }
        return true;
      });

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recordType) {
      toast.error('Please select a record type.');
      return;
    }

    if (!details.trim()) {
      toast.error('Please enter details.');
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one file.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('recordType', recordType);
      formData.append('doctorName', doctorName);
      formData.append('hospitalName', hospitalName);
      formData.append('details', details);
      formData.append('date', new Date().toISOString());

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      await healthRecords.create(formData);
      toast.success('Health record uploaded successfully!');

      // Reset form
      setFiles([]);
      setRecordType('');
      setDoctorName('');
      setHospitalName('');
      setDetails('');
    } catch (error) {
      toast.error('Failed to upload health record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6">Upload Health Record</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="recordType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Record Type
          </label>
          <select
            id="recordType"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-required="true"
          >
            <option value="">Select record type</option>
            <option value="prescription">Prescription</option>
            <option value="labReport">Lab Report</option>
            <option value="vaccination">Vaccination Record</option>
            <option value="general">General Record</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="doctorName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Doctor's Name
          </label>
          <input
            id="doctorName"
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter doctor's name"
          />
        </div>

        <div>
          <label
            htmlFor="hospitalName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hospital/Clinic Name
          </label>
          <input
            id="hospitalName"
            type="text"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter hospital/clinic name"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Details
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter additional details..."
            required
            aria-required="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6"
            aria-label="File upload area"
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-indigo-600">
                    Click to upload or drag and drop
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    aria-label="Upload health record files"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, JPG, JPEG, PNG up to {MAX_FILE_SIZE_MB}MB each
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label={`Remove file ${file.name}`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className={`
              bg-indigo-600 text-white px-6 py-2 rounded-lg
              hover:bg-indigo-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? 'Uploading...' : 'Upload Record'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HealthRecordUpload;
