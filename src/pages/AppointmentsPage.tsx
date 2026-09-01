import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, User, Clock, CheckCircle, AlertCircle, XCircle, Search, Star, Stethoscope } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface Doctor { _id?: string; name: string; specialization: string; }
interface Appointment {
  _id: string; date: string; time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctor: Doctor; doctorId?: string | Doctor;
  hasRated?: boolean; userRating?: number; userReview?: string;
}

type FilterType = 'all' | 'upcoming' | 'missed' | 'completed' | 'cancelled';

const AppointmentsPage = () => {
  const { user } = useHealthSaathi();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const allRes = await axiosInstance.get('/appointments');
        const allData = Array.isArray(allRes.data) ? allRes.data : allRes.data.appointments || [];
        let completedData: any[] = [];
        try { const cr = await axiosInstance.get('/appointments/completed'); completedData = cr.data.appointments || []; } catch {}
        const formatted = allData.map((a: any) => {
          const ratedMatch = completedData.find((c: any) => c._id === a._id);
          const doctorInfo = a.doctorId || a.doctor || { name: 'Unknown', specialization: '' };
          return { ...a, hasRated: ratedMatch?.hasRated ?? false, userRating: ratedMatch?.userRating ?? 0, userReview: ratedMatch?.userReview ?? '', doctor: doctorInfo };
        });
        setAppointments(formatted);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const parseDate = (d: string, t: string) => {
    try { const dt = new Date(`${d}T${t}:00`); return isNaN(dt.getTime()) ? new Date(d) : dt; }
    catch { return new Date(); }
  };

  const isUpcoming = (a: Appointment) => a.status === 'upcoming' && parseDate(a.date, a.time) > new Date();
  const isMissed = (a: Appointment) => a.status === 'upcoming' && parseDate(a.date, a.time) <= new Date();
  const getDoctorId = (a: Appointment): string => {
    if (typeof a.doctorId === 'object' && a.doctorId?._id) return a.doctorId._id;
    if (typeof a.doctorId === 'string') return a.doctorId;
    return a.doctor?._id || '';
  };

  const getFiltered = () => {
    let list = appointments;
    if (filter === 'upcoming') list = list.filter(isUpcoming);
    else if (filter === 'missed') list = list.filter(isMissed);
    else if (filter === 'completed') list = list.filter(a => a.status === 'completed');
    else if (filter === 'cancelled') list = list.filter(a => a.status === 'cancelled');
    if (searchTerm) list = list.filter(a =>
      a.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return list.sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime());
  };

  const counts = {
    all: appointments.length,
    upcoming: appointments.filter(isUpcoming).length,
    missed: appointments.filter(isMissed).length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const getStatusBadge = (a: Appointment) => {
    if (isMissed(a)) return <span className="badge-red">Missed</span>;
    switch (a.status) {
      case 'upcoming': return <span className="badge-blue">Upcoming</span>;
      case 'completed': return <span className="badge-green">Completed</span>;
      case 'cancelled': return <span className="badge-gray">Cancelled</span>;
      default: return <span className="badge-gray">Unknown</span>;
    }
  };

  const getStatusIcon = (a: Appointment) => {
    if (isMissed(a)) return <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div>;
    switch (a.status) {
      case 'upcoming': return <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>;
      case 'completed': return <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>;
      case 'cancelled': return <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><XCircle className="w-5 h-5 text-slate-500" /></div>;
      default: return <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5 text-slate-500" /></div>;
    }
  };

  const filtered = getFiltered();
  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'upcoming', label: `Upcoming (${counts.upcoming})` },
    { key: 'completed', label: `Completed (${counts.completed})` },
    { key: 'missed', label: `Missed (${counts.missed})` },
    { key: 'cancelled', label: `Cancelled (${counts.cancelled})` },
  ];

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-4xl">
        <PageNav />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="hs-page-title">My Appointments</h1>
            <p className="text-slate-500 mt-1">Track and manage your healthcare visits</p>
          </div>
          <Link to="/doctors" className="btn-primary btn-sm whitespace-nowrap">
            <Calendar className="w-4 h-4" /> Book Appointment
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-700'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="hs-input pl-10" placeholder="Search by doctor name or specialty..." />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="hs-spinner w-10 h-10" /></div>
        ) : filtered.length === 0 ? (
          <div className="hs-card p-16 text-center">
            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No appointments found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'You have no appointments yet'}
            </p>
            <Link to="/doctors" className="btn-primary btn-sm">Book an Appointment</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => {
              const doctorId = getDoctorId(a);
              return (
                <div key={a._id} className="hs-card p-5 hover:shadow-card-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(a)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-slate-800">{a.doctor?.name || 'Doctor'}</h3>
                          <p className="text-sm text-slate-500">{a.doctor?.specialization}</p>
                        </div>
                        {getStatusBadge(a)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {a.time}
                        </span>
                      </div>
                      {a.status === 'completed' && !a.hasRated && doctorId && (
                        <div className="mt-3">
                          <Link
                            to="/rate-doctor"
                            state={{ doctorId, doctorName: a.doctor?.name, appointmentId: a._id }}
                            className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 text-sm font-medium bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Star className="w-3.5 h-3.5" /> Rate this visit
                          </Link>
                        </div>
                      )}
                      {a.status === 'completed' && a.hasRated && (
                        <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Rated {a.userRating}/5
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;