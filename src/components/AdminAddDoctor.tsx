import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Plus, Trash2, Stethoscope, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageNav from './common/PageNav';

interface AvailabilitySlot { day: string; slots: { startTime: string; endTime: string }[]; }

const specializations = [
  'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
  'Psychiatry', 'Orthopedics', 'Gynecology', 'General Surgery',
  'ENT', 'Ophthalmology', 'General Medicine', 'Dentistry',
];
const languagesList = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Bengali'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminAddDoctor: React.FC = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [fees, setFees] = useState<number | ''>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLanguageDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const resetForm = () => { setName(''); setSpecialization(''); setExperience(''); setLanguages([]); setAvailability([]); setImageUrl(''); setFees(''); };
  const toggleLanguage = (lang: string) => setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  const addAvailabilityDay = () => {
    const unusedDay = daysOfWeek.find(day => !availability.some(a => a.day === day));
    if (unusedDay) setAvailability(prev => [...prev, { day: unusedDay, slots: [{ startTime: '09:00', endTime: '17:00' }] }]);
  };

  const addDoctor = async () => {
    setErrorMessage(''); setSuccessMessage('');
    if (!name || !specialization || !experience || !languages.length || !availability.length || !fees) {
      setErrorMessage('Please fill all required (*) fields'); return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post('/admin/add-doctor', { name, specialization, experience: Number(experience), languages, availability, imageUrl, fees: Number(fees) });
      setSuccessMessage(`Dr. ${name} added successfully!`);
      resetForm();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add doctor');
    } finally { setSubmitting(false); }
  };

  const updateAvailabilityDay = (idx: number, newDay: string) =>
    setAvailability(prev => prev.map((item, i) => i === idx ? { ...item, day: newDay } : item));

  const updateTimeSlot = (dayIdx: number, slotIdx: number, field: 'startTime' | 'endTime', value: string) =>
    setAvailability(prev => prev.map((item, i) =>
      i === dayIdx ? { ...item, slots: item.slots.map((slot, si) => si === slotIdx ? { ...slot, [field]: value } : slot) } : item
    ));

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-3xl">
        <PageNav />

        {/* Admin header */}
        <div className="gradient-warm rounded-3xl p-6 mb-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Doctor</h1>
              <p className="text-white/70 text-sm">Register a new doctor in the HealthSaathi network</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Link to="/admin/doctors" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              Manage Doctors
            </Link>
          </div>
        </div>

        {successMessage && (
          <div className="hs-alert-success mb-6">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="hs-alert-error mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="hs-card p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="hs-label">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="hs-input pl-10" placeholder="Dr. Full Name" />
              </div>
            </div>
            <div>
              <label className="hs-label">Specialization <span className="text-red-500">*</span></label>
              <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="hs-select">
                <option value="">Select specialization...</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="hs-label">Experience (years) <span className="text-red-500">*</span></label>
              <input type="number" min={0} value={experience} onChange={e => setExperience(Number(e.target.value))} className="hs-input" placeholder="Years of experience" />
            </div>
            <div>
              <label className="hs-label">Consultation Fees (₹) <span className="text-red-500">*</span></label>
              <input type="number" min={0} value={fees} onChange={e => setFees(Number(e.target.value))} className="hs-input" placeholder="e.g. 500" />
            </div>
            <div className="sm:col-span-2">
              <label className="hs-label">Profile Image URL <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="hs-input" placeholder="https://example.com/photo.jpg" />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="hs-label">Languages <span className="text-red-500">*</span></label>
            <div className="relative" ref={dropdownRef}>
              <div
                className="hs-input cursor-pointer flex items-center justify-between min-h-[2.75rem]"
                onClick={() => setLanguageDropdownOpen(p => !p)}
              >
                <div className="flex flex-wrap gap-1.5">
                  {languages.length === 0
                    ? <span className="text-slate-400 text-sm">Select languages...</span>
                    : languages.map(lang => (
                      <span key={lang} className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {lang}
                        <button type="button" onClick={e => { e.stopPropagation(); toggleLanguage(lang); }}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 flex-shrink-0 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {languageDropdownOpen && (
                <div className="absolute z-20 bg-white mt-1 border border-slate-200 rounded-xl shadow-card-md max-h-48 overflow-y-auto w-full">
                  {languagesList.map(lang => (
                    <div key={lang} onClick={() => toggleLanguage(lang)}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-50 text-sm ${languages.includes(lang) ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-700'}`}>
                      {lang}
                      {languages.includes(lang) && <CheckCircle className="w-4 h-4 text-primary-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="hs-label">Availability Schedule <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              {availability.map((availDay, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <select value={availDay.day} onChange={e => updateAvailabilityDay(i, e.target.value)} className="hs-select w-40 py-1.5 text-sm">
                      {daysOfWeek.map(day => (
                        <option key={day} value={day} disabled={availability.some(a => a.day === day && a !== availDay)}>{day}</option>
                      ))}
                    </select>
                    <button onClick={() => setAvailability(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {availDay.slots.map((slot, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <input type="time" value={slot.startTime} onChange={e => updateTimeSlot(i, si, 'startTime', e.target.value)}
                          className="hs-input py-1.5 text-sm w-32" />
                        <span className="text-slate-400 text-sm">to</span>
                        <input type="time" value={slot.endTime} onChange={e => updateTimeSlot(i, si, 'endTime', e.target.value)}
                          className="hs-input py-1.5 text-sm w-32" />
                        {availDay.slots.length > 1 && (
                          <button onClick={() => setAvailability(prev => prev.map((day, di) => di === i ? { ...day, slots: day.slots.filter((_, s) => s !== si) } : day))}
                            className="p-1 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setAvailability(prev => prev.map((day, di) => di === i ? { ...day, slots: [...day.slots, { startTime: '09:00', endTime: '17:00' }] } : day))}
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-800 text-sm font-medium mt-1">
                      <Plus className="w-3.5 h-3.5" /> Add Time Slot
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addAvailabilityDay}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors font-medium text-sm">
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={addDoctor} disabled={submitting} className="btn-primary w-full justify-center text-base py-3 mt-2">
            {submitting
              ? <span className="flex items-center gap-2"><span className="hs-spinner w-4 h-4" />Adding Doctor...</span>
              : <span className="flex items-center gap-2"><Stethoscope className="w-4 h-4" />Add Doctor</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddDoctor;
