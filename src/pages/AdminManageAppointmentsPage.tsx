import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Calendar, Clock, CheckCircle, XCircle, Filter, Search, X, Save } from 'lucide-react';

interface Appointment {
  _id: string;
  userId: { _id: string; name: string; phoneNumber?: string };
  doctorId: { _id: string; name: string; specialization: string };
  date: string; time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const STATUS_BADGE = {
  upcoming: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-gray',
};

const AdminManageAppointmentsPage = () => {
  const { user } = useHealthSaathi();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, 'completed' | 'cancelled'>>({});
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { if (user?.role !== 'admin') navigate('/'); }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/appointments/all')
      .then(r => setAppointments(r.data))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckboxChange = (id: string, status: 'completed' | 'cancelled') => {
    setSelectedStatus(prev => {
      const next = { ...prev };
      if (next[id] === status) delete next[id]; else next[id] = status;
      return next;
    });
  };

  const applyChanges = async () => {
    const updates = Object.entries(selectedStatus);
    if (!updates.length) { toast('No changes selected'); return; }
    setApplying(true);
    try {
      for (const [id, status] of updates) {
        await axiosInstance.patch(`/appointments/${id}/status`, { status });
      }
      toast.success(`${updates.length} appointment(s) updated`);
      setAppointments(prev => prev.map(a => selectedStatus[a._id] ? { ...a, status: selectedStatus[a._id] } : a));
      setSelectedStatus({});
    } catch { toast.error('Failed to update some appointments'); }
    finally { setApplying(false); }
  };

  const filtered = appointments.filter(a => {
    const matchSearch = !searchTerm ||
      a.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="hs-page">
      <div className="hs-container">
        {/* Header */}
        <div className="gradient-warm rounded-3xl p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Appointment Management</h1>
              <p className="text-white/70 text-sm">Review and update appointment statuses</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/admin/doctors" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              Manage Doctors
            </Link>
            <Link to="/admin/add-doctor" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              Add Doctor
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: counts.total, color: 'text-violet-700', bg: 'bg-violet-100' },
            { label: 'Upcoming', value: counts.upcoming, color: 'text-blue-700', bg: 'bg-blue-100' },
            { label: 'Completed', value: counts.completed, color: 'text-emerald-700', bg: 'bg-emerald-100' },
            { label: 'Cancelled', value: counts.cancelled, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map(s => (
            <div key={s.label} className="hs-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="hs-input pl-10" placeholder="Search patient or doctor..." />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="hs-select sm:w-44">
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {Object.keys(selectedStatus).length > 0 && (
            <button onClick={applyChanges} disabled={applying}
              className="btn-primary whitespace-nowrap">
              <Save className="w-4 h-4" />
              {applying ? 'Applying...' : `Apply ${Object.keys(selectedStatus).length} Changes`}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="hs-spinner w-10 h-10" /></div>
        ) : filtered.length === 0 ? (
          <div className="hs-card p-16 text-center">
            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="hs-card overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Mark As</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(apt => (
                    <tr key={apt._id} className={`hover:bg-slate-50 transition-colors ${selectedStatus[apt._id] ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 text-sm">{apt.userId?.name || '—'}</p>
                        <p className="text-xs text-slate-500">{apt.userId?.phoneNumber || ''}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700 text-sm">{apt.doctorId?.name || '—'}</p>
                        <p className="text-xs text-slate-500">{apt.doctorId?.specialization}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-slate-500">{apt.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={STATUS_BADGE[selectedStatus[apt._id] || apt.status] || 'badge-gray'}>
                          {selectedStatus[apt._id] ? `→ ${selectedStatus[apt._id]}` : apt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {apt.status === 'upcoming' ? (
                          <div className="flex items-center justify-center gap-3">
                            <label className="flex items-center gap-1.5 text-sm text-emerald-700 cursor-pointer">
                              <input type="checkbox" checked={selectedStatus[apt._id] === 'completed'} onChange={() => handleCheckboxChange(apt._id, 'completed')}
                                className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                              Done
                            </label>
                            <label className="flex items-center gap-1.5 text-sm text-red-600 cursor-pointer">
                              <input type="checkbox" checked={selectedStatus[apt._id] === 'cancelled'} onChange={() => handleCheckboxChange(apt._id, 'cancelled')}
                                className="w-4 h-4 text-red-600 rounded border-slate-300" />
                              Cancel
                            </label>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 text-center capitalize">—</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map(apt => (
                <div key={apt._id} className={`p-4 ${selectedStatus[apt._id] ? 'bg-amber-50/50' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800">{apt.userId?.name || '—'}</p>
                      <p className="text-sm text-slate-500">{apt.doctorId?.name} · {apt.doctorId?.specialization}</p>
                      <p className="text-xs text-slate-400">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                    </div>
                    <span className={STATUS_BADGE[apt.status] || 'badge-gray'}>{apt.status}</span>
                  </div>
                  {apt.status === 'upcoming' && (
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 text-sm text-emerald-700 cursor-pointer">
                        <input type="checkbox" checked={selectedStatus[apt._id] === 'completed'} onChange={() => handleCheckboxChange(apt._id, 'completed')} className="w-4 h-4 text-emerald-600 rounded" />
                        Mark Completed
                      </label>
                      <label className="flex items-center gap-2 text-sm text-red-600 cursor-pointer">
                        <input type="checkbox" checked={selectedStatus[apt._id] === 'cancelled'} onChange={() => handleCheckboxChange(apt._id, 'cancelled')} className="w-4 h-4 text-red-600 rounded" />
                        Cancel
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageAppointmentsPage;