import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FileText, Upload, Calendar, User2, Building2, ChevronDown, ChevronUp, Trash2, Download, X } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface Attachment {
  filename: string;
  url: string;
  contentType: string;
}

interface HealthRecord {
  _id: string;
  recordType: string;
  date: string;
  doctorName: string;
  hospitalName: string;
  details: string;
  attachments: Attachment[];
  createdAt: string;
}

const RECORD_TYPES = ['Lab Report', 'Prescription', 'X-Ray', 'MRI', 'Ultrasound', 'Blood Test', 'Other'];

const HealthRecordsPage = () => {
  const { user } = useHealthSaathi();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form state
  const [form, setForm] = useState({
    recordType: '',
    date: '',
    doctorName: '',
    hospitalName: '',
    details: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/health-records');
      setRecords(res.data);
    } catch (err) {
      console.error('Failed to fetch health records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!form.recordType || !form.date) {
      setUploadError('Record type and date are required.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      files.forEach(file => formData.append('attachments', file));

      await axiosInstance.post('/health-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setForm({ recordType: '', date: '', doctorName: '', hospitalName: '', details: '' });
      setFiles([]);
      setShowUploadForm(false);
      await fetchRecords();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this health record?')) return;
    try {
      await axiosInstance.delete(`/health-records/${id}`);
      setRecords(prev => prev.filter(r => r._id !== id));
      if (expandedRecord === id) setExpandedRecord(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Lab Report': 'bg-blue-100 text-blue-700',
      'Prescription': 'bg-green-100 text-green-700',
      'X-Ray': 'bg-purple-100 text-purple-700',
      'MRI': 'bg-orange-100 text-orange-700',
      'Ultrasound': 'bg-pink-100 text-pink-700',
      'Blood Test': 'bg-red-100 text-red-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <PageNav />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Your complete medical history in one place</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md"
        >
          <Upload className="h-4 w-4" />
          {showUploadForm ? 'Cancel' : 'Add Record'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Add New Health Record
          </h2>

          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <X className="h-4 w-4" />
              {uploadError}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type *</label>
                <select
                  value={form.recordType}
                  onChange={(e) => handleFormChange('recordType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type...</option>
                  {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) => handleFormChange('doctorName', e.target.value)}
                  placeholder="Dr. Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={form.hospitalName}
                  onChange={(e) => handleFormChange('hospitalName', e.target.value)}
                  placeholder="Hospital name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Details</label>
              <textarea
                value={form.details}
                onChange={(e) => handleFormChange('details', e.target.value)}
                rows={3}
                placeholder="Any additional notes about this record..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (PDF, JPG, PNG — max 5 files, 5MB each)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Save Record'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records List */}
      {records.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No health records yet</h3>
          <p className="text-gray-500 mb-6">Start building your medical history by adding your first health record</p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Upload className="h-5 w-5" />
            Add Your First Record
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div
              key={record._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{record.recordType}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRecordTypeColor(record.recordType)}`}>
                          {record.recordType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {record.doctorName && (
                          <span className="flex items-center gap-1">
                            <User2 className="h-3.5 w-3.5" />
                            {record.doctorName}
                          </span>
                        )}
                        {record.hospitalName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {record.hospitalName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.attachments.length > 0 && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                        {record.attachments.length} file{record.attachments.length > 1 ? 's' : ''}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedRecord === record._id
                      ? <ChevronUp className="h-5 w-5 text-gray-400" />
                      : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {expandedRecord === record._id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {record.details && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Notes</p>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{record.details}</p>
                    </div>
                  )}
                  {record.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {record.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'}${att.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            {att.filename}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-4">
                    Added on {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecordsPage;