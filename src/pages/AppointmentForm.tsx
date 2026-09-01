import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import { Calendar, Clock, Stethoscope, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import PageNav from '../components/common/PageNav';

interface Doctor {
  name?: string; specialization?: string;
  availability: { day: string; slots: { startTime: string; endTime: string }[] }[];
}

const parseTime = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const AppointmentForm: React.FC = () => {
  const { id: doctorId } = useParams();
  const { user } = useHealthSaathi();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<{ slot: string; available: boolean }[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (doctorId) {
      axiosInstance.get(`/doctors/${doctorId}`).then(r => setDoctor(r.data)).catch(() => setErrorMessage('Failed to load doctor info'));
    }
  }, [doctorId]);

  useEffect(() => {
    if (!date || !doctor) return;
    (async () => {
      setSlotsLoading(true);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const dayAv = doctor.availability.find(a => a.day.toLowerCase() === dayName.toLowerCase());
      if (!dayAv || !dayAv.slots.length) { setSlots([]); setSlotsLoading(false); return; }
      const generated: string[] = [];
      for (const s of dayAv.slots) {
        const start = parseTime(s.startTime); const end = parseTime(s.endTime);
        for (let t = start; t + 60 <= end; t += 60) generated.push(`${fmt(t)}-${fmt(t + 60)}`);
      }
      try {
        const appts = await axiosInstance.get('/appointments', { params: { doctor: doctorId, date } });
        const taken = appts.data.map((a: any) => a.time);
        setSlots(generated.map(slot => ({ slot, available: !taken.includes(slot.split('-')[0]) })));
      } catch { setErrorMessage('Failed to load slots'); }
      finally { setSlotsLoading(false); }
    })();
  }, [date, doctor, doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !doctorId) { setErrorMessage('Please select a time slot'); return; }
    setLoading(true); setErrorMessage('');
    try {
      await axiosInstance.post('/appointments', { doctorId, date, time: selectedSlot.split('-')[0], symptoms: symptoms || 'No symptoms provided' });
      setSuccessMessage('Appointment booked successfully!');
      setSelectedSlot(''); setDate(''); setSymptoms('');
      setTimeout(() => { navigate('/appointments'); }, 2500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-3xl">
        <PageNav />

        <div className="mb-6">
          <h1 className="hs-page-title">Book Appointment</h1>
          <p className="text-slate-500 mt-1">Schedule a consultation with your healthcare provider</p>
        </div>

        {/* Doctor info */}
        {doctor && (
          <div className="hs-card mb-6 overflow-hidden">
            <div className="h-2 gradient-health" />
            <div className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 gradient-health rounded-2xl flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">{doctor.name || 'Doctor'}</h2>
                <p className="text-primary-600 font-medium">{doctor.specialization || 'General Medicine'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Availability overview */}
        {doctor?.availability?.length ? (
          <div className="hs-card p-5 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" /> Availability
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {doctor.availability.map((a, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-slate-700">{a.day}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {a.slots.length > 0 ? `${a.slots[0].startTime} – ${a.slots[a.slots.length - 1].endTime}` : 'Unavailable'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Booking form */}
        <div className="hs-card p-6">
          {successMessage ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Appointment Booked!</h3>
              <p className="text-slate-500 mb-4">{successMessage}</p>
              <p className="text-sm text-slate-400">Redirecting to appointments...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="hs-alert-error">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Date selection */}
              <div>
                <label className="hs-label">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="date" value={date} min={today}
                    onChange={e => { setDate(e.target.value); setSelectedSlot(''); setSlots([]); }}
                    className="hs-input pl-10" required />
                </div>
              </div>

              {/* Slot selection */}
              {date && (
                <div>
                  <label className="hs-label">Select Time Slot</label>
                  {slotsLoading ? (
                    <div className="flex justify-center py-6"><div className="hs-spinner w-7 h-7" /></div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">No slots available for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map(({ slot, available }) => (
                        <button key={slot} type="button" disabled={!available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                            !available ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                            : selectedSlot === slot ? 'bg-primary-600 text-white shadow-md scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                          }`}>
                          {slot.split('-')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedSlot && (
                    <p className="mt-2 text-sm text-primary-600 font-medium">
                      ✓ Selected: {selectedSlot}
                    </p>
                  )}
                </div>
              )}

              {/* Symptoms */}
              <div>
                <label className="hs-label">Symptoms / Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
                    className="hs-input pl-10 resize-none"
                    placeholder="Describe your symptoms or reason for visit..." />
                </div>
              </div>

              <button type="submit" disabled={loading || !selectedSlot || !date}
                className="btn-primary w-full justify-center text-base py-3">
                {loading
                  ? <span className="flex items-center gap-2"><span className="hs-spinner w-4 h-4" />Booking...</span>
                  : <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Confirm Appointment</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;