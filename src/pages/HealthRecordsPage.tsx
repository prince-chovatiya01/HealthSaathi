import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FileText, Upload, Calendar, User, Building2, ChevronDown, ChevronUp, Trash2, Download, X, Plus, Paperclip } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface Attachment { filename: string; url: string; contentType: string; }
interface HealthRecord { _id: string; recordType: string; date: string; doctorName: string; hospitalName: string; details: string; attachments: Attachment[]; createdAt: string; }

const RECORD_TYPES = ['Lab Report', 'Prescription', 'X-Ray', 'MRI', 'Ultrasound', 'Blood Test', 'Other'];
const TYPE_COLORS: Record<string, string> = {
  'Lab Report': 'badge-blue', 'Prescription': 'badge-green', 'X-Ray': 'badge-teal',
  'MRI': 'badge-yellow', 'Ultrasound': 'badge-yellow', 'Blood Test': 'badge-red', 'Other': 'badge-gray',
};
const TYPE_BG: Record<string, string> = {
  'Lab Report': 'bg-blue-50 text-blue-700', 'Prescription': 'bg-emerald-50 text-emerald-700',
  'X-Ray': 'bg-teal-50 text-teal-700', 'MRI': 'bg-amber-50 text-amber-700',
  'Ultrasound': 'bg-orange-50 text-orange-700', 'Blood Test': 'bg-red-50 text-red-700',
  'Other': 'bg-slate-50 text-slate-600',
};

const SERVER_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace('/api', '');

const HealthRecordsPage = () => {
  const { user } = useHealthSaathi();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [form, setForm] = useState({ recordType: '', date: '', doctorName: '', hospitalName: '', details: '' });
  const [files, setFiles] = useState<File[]>([]);

  const fetchRecords = async () => {
    try { const r = await axiosInstance.get('/health-records'); setRecords(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchRecords(); }, [user]);
  if (!user) return <Navigate to="/login" />;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); setUploadError('');
    if (!form.recordType || !form.date) { setUploadError('Record type and date are required'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('attachments', f));
      await axiosInstance.post('/health-records', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ recordType: '', date: '', doctorName: '', hospitalName: '', details: '' });
      setFiles([]); setShowUploadForm(false); await fetchRecords();
    } catch (err: any) { setUploadError(err.response?.data?.message || 'Failed to upload record'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/health-records/${id}`);
      setRecords(prev => prev.filter(r => r._id !== id));
      if (expandedRecord === id) setExpandedRecord(null);
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-4xl">
        <PageNav />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="hs-page-title">Health Records</h1>
            <p className="text-slate-500 mt-1">Your complete medical history in one place</p>
          </div>
          <button onClick={() => setShowUploadForm(!showUploadForm)}
            className={showUploadForm ? 'btn-outline' : 'btn-primary'}>
            {showUploadForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Record</>}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="hs-card p-6 mb-6 border-l-4 border-l-primary-500">
            <h2 className="font-bold text-slate-900 text-lg mb-5 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-600" /> Add New Health Record
            </h2>
            {uploadError && <div className="hs-alert-error mb-4"><span>⚠️</span><span>{uploadError}</span></div>}
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="hs-label">Record Type *</label>
                  <select value={form.recordType} onChange={e => setForm(p => ({ ...p, recordType: e.target.value }))} className="hs-select" required>
                    <option value="">Select type...</option>
                    {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="hs-label">Date *</label>
                  <input type="date" value={form.date} max={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="hs-input" required />
                </div>
                <div>
                  <label className="hs-label">Doctor Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.doctorName} onChange={e => setForm(p => ({ ...p, doctorName: e.target.value }))} className="hs-input pl-10" placeholder="Dr. Name" />
                  </div>
                </div>
                <div>
                  <label className="hs-label">Hospital / Clinic</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.hospitalName} onChange={e => setForm(p => ({ ...p, hospitalName: e.target.value }))} className="hs-input pl-10" placeholder="Hospital name" />
                  </div>
                </div>
              </div>
              <div>
                <label className="hs-label">Notes</label>
                <textarea value={form.details} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} rows={3} className="hs-input resize-none" placeholder="Additional notes or findings..." />
              </div>
              <div>
                <label className="hs-label">Attachments <span className="text-slate-400 font-normal">(PDF, JPG, PNG — max 5 files, 10MB each)</span></label>
                <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
                  <Paperclip className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-500 text-sm">{files.length > 0 ? `${files.length} file(s) selected` : 'Click to choose files'}</span>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" onChange={e => setFiles(Array.from(e.target.files || []).slice(0, 5))} className="hidden" />
                </label>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((f, i) => (
                      <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">{f.name}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading} className="btn-primary">
                  <Upload className="w-4 h-4" /> {uploading ? 'Saving...' : 'Save Record'}
                </button>
                <button type="button" onClick={() => setShowUploadForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Records list */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="hs-spinner w-10 h-10" /></div>
        ) : records.length === 0 ? (
          <div className="hs-card p-16 text-center">
            <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No health records yet</h3>
            <p className="text-slate-500 mb-6">Start building your medical history</p>
            <button onClick={() => setShowUploadForm(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Your First Record
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map(record => (
              <div key={record._id} className="hs-card overflow-hidden hover:shadow-card-md transition-shadow">
                {/* Record header — click to expand */}
                <div className="p-5 cursor-pointer" onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_BG[record.recordType] || TYPE_BG['Other']}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TYPE_BG[record.recordType] || TYPE_BG['Other']}`}>{record.recordType}</span>
                          {record.attachments.length > 0 && (
                            <span className="text-xs text-slate-400">{record.attachments.length} file{record.attachments.length > 1 ? 's' : ''}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          {record.doctorName && <span className="flex items-center gap-1"><User className="w-3 h-3" />{record.doctorName}</span>}
                          {record.hospitalName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{record.hospitalName}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); handleDelete(record._id); }}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedRecord === record._id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {expandedRecord === record._id && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 bg-slate-50">
                    {record.details && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</p>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl">{record.details}</p>
                      </div>
                    )}
                    {record.attachments.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Attachments</p>
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((att, i) => (
                            <a key={i} href={`${SERVER_BASE}${att.url}`} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 text-sm bg-white border border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-700 hover:text-primary-700 px-3 py-2 rounded-xl transition-all">
                              <Download className="w-3.5 h-3.5" />
                              <span className="max-w-[150px] truncate">{att.filename.replace(/^\d+-/, '')}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-4">Added {new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordsPage;