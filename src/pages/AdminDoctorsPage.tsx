import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import { Stethoscope, Trash2, Plus, Search, Star, Shield, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Doctor {
  _id: string; name: string; specialization: string; experience: number;
  languages: string[]; fees: number; availability: any[]; rating?: number; reviewCount?: number;
}

const AdminDoctorsPage = () => {
  const { user: authUser } = useHealthSaathi();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { if (authUser?.role !== 'admin') navigate('/dashboard'); }, [authUser, navigate]);
  useEffect(() => {
    axiosInstance.get('/admin/doctors').then(r => setDoctors(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove Dr. ${name}? This will also delete all their ratings.`)) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/admin/${id}`);
      setDoctors(p => p.filter(d => d._id !== id));
      setMessage({ type: 'success', text: `Dr. ${name} removed successfully.` });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete doctor' });
    } finally { setDeletingId(null); }
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hs-page">
      <div className="hs-container">
        {/* Admin header */}
        <div className="gradient-warm rounded-3xl p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Doctor Management</h1>
              <p className="text-white/70 text-sm">Manage all registered doctors in the system</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/admin/add-doctor" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              <Plus className="w-4 h-4" /> Add New Doctor
            </Link>
            <Link to="/admin/manage-appointments" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              Manage Appointments
            </Link>
          </div>
        </div>

        {message && (
          <div className={`${message.type === 'success' ? 'hs-alert-success' : 'hs-alert-error'} mb-6`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="hs-card p-4 text-center">
            <p className="text-2xl font-bold text-primary-700">{doctors.length}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Total Doctors</p>
          </div>
          <div className="hs-card p-4 text-center">
            <p className="text-2xl font-bold text-teal-700">{[...new Set(doctors.map(d => d.specialization))].length}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Specializations</p>
          </div>
          <div className="hs-card p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{doctors.filter(d => (d.rating || 0) >= 4).length}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Top Rated (4+)</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="hs-input pl-10" placeholder="Search doctors by name or specialty..." />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="hs-spinner w-10 h-10" /></div>
        ) : filtered.length === 0 ? (
          <div className="hs-card p-16 text-center">
            <Stethoscope className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">{searchTerm ? 'No doctors match your search' : 'No doctors registered yet'}</p>
            <Link to="/admin/add-doctor" className="btn-primary btn-sm mt-4 inline-flex">Add First Doctor</Link>
          </div>
        ) : (
          <div className="hs-card overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Specialty</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Experience</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fee</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(doc => (
                    <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.languages?.join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge-blue">{doc.specialization}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{doc.experience} yrs</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">₹{doc.fees}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{doc.rating ? doc.rating.toFixed(1) : '–'}</span>
                          {doc.reviewCount ? <span className="text-slate-400">({doc.reviewCount})</span> : null}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleDelete(doc._id, doc.name)}
                          disabled={deletingId === doc._id}
                          className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                          {deletingId === doc._id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map(doc => (
                <div key={doc._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{doc.name}</p>
                        <p className="text-sm text-primary-600">{doc.specialization}</p>
                        <p className="text-xs text-slate-500 mt-1">{doc.experience} yrs · ₹{doc.fees}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(doc._id, doc.name)} disabled={deletingId === doc._id}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctorsPage;
