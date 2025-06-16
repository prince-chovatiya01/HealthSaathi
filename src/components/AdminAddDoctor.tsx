import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Plus, Trash2 } from 'lucide-react';

interface AvailabilitySlot {
  day: string;
  slots: { startTime: string; endTime: string }[];
}

const specializations = [
  "Cardiology", "Dermatology", "Neurology", "Pediatrics",
  "Psychiatry", "Orthopedics", "Gynecology", "General Surgery"
];

const languagesList = ["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Bengali"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminAddDoctor: React.FC = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [fees, setFees] = useState<number | ''>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetForm = () => {
    setName('');
    setSpecialization('');
    setExperience('');
    setLanguages([]);
    setAvailability([]);
    setImageUrl('');
    setFees('');
  };

  const toggleLanguage = (language: string) => {
    setLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const addAvailabilityDay = () => {
    const unusedDay = daysOfWeek.find(day => !availability.some(a => a.day === day));
    if (!unusedDay) return;
    setAvailability(prev => [...prev, { day: unusedDay, slots: [{ startTime: '09:00', endTime: '17:00' }] }]);
  };

  const addDoctor = async () => {
    if (!name || !specialization || !experience || languages.length === 0 || availability.length === 0 || !fees) {
      alert('❌ Please fill all required (*) fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/add-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          specialization,
          experience,
          languages,
          availability,
          imageUrl,
          fees,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add doctor');
      }

      const result = await response.json();
      console.log(result);
      alert('✅ Doctor added successfully!');

      // Reset form
      setName('');
      setSpecialization('');
      setExperience(0);
      setLanguages([]);
      setAvailability([]);
      setImageUrl('');
      setFees(0);
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add doctor');
    }
  };


  const updateAvailabilityDay = (index: number, newDay: string) => {
    setAvailability(prev =>
      prev.map((item, i) => i === index ? { ...item, day: newDay } : item)
    );
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => prev.map((item, i) =>
      i === dayIndex
        ? {
          ...item,
          slots: item.slots.map((slot, si) => si === slotIndex ? { ...slot, [field]: value } : slot)
        }
        : item
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Add Doctor</h2>

      {/* Name */}
      <Input label="Name" required value={name} onChange={setName} placeholder="Doctor's full name" />

      {/* Specialization */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">Specialization<span className="text-red-500 ml-1">*</span></label>
        <select
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">-- Select Specialization --</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <Input label="Experience (years)" required type="number" min={0} value={experience} onChange={setExperience} placeholder="Years of experience" />

      {/* Language Multi-select */}
      <div className="mb-4" ref={dropdownRef}>
        <label className="block font-semibold text-gray-700 mb-1">Languages<span className="text-red-500 ml-1">*</span></label>
        <div
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center"
          onClick={() => setLanguageDropdownOpen(prev => !prev)}
        >
          <div className="flex flex-wrap gap-2">
            {languages.length === 0
              ? <span className="text-gray-400">Select languages...</span>
              : languages.map(lang => (
                <span key={lang} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {lang}
                  <X size={14} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleLanguage(lang); }} />
                </span>
              ))}
          </div>
          <ChevronDown className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
        {languageDropdownOpen && (
          <div className="absolute z-10 bg-white mt-1 border-2 border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto w-full">
            {languagesList.map(lang => (
              <div
                key={lang}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${languages.includes(lang) ? 'bg-indigo-50 text-indigo-700' : ''}`}
                onClick={() => toggleLanguage(lang)}
              >
                <div className="flex justify-between items-center">
                  {lang}
                  {languages.includes(lang) && <div className="w-4 h-4 bg-indigo-500 rounded-full flex justify-center items-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">Availability<span className="text-red-500 ml-1">*</span></label>
        <div className="space-y-4">
          {availability.map((availDay, i) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={availDay.day}
                  onChange={(e) => updateAvailabilityDay(i, e.target.value)}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day} disabled={availability.some(a => a.day === day && a !== availDay)}>
                      {day}
                    </option>
                  ))}
                </select>
                <button onClick={() => setAvailability(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 size={18} /></button>
              </div>
              {availDay.slots.map((slot, si) => (
                <div key={si} className="flex items-center gap-2 mb-2">
                  <input type="time" className="border border-gray-300 rounded-md px-2 py-1" value={slot.startTime} onChange={(e) => updateTimeSlot(i, si, 'startTime', e.target.value)} />
                  <span>to</span>
                  <input type="time" className="border border-gray-300 rounded-md px-2 py-1" value={slot.endTime} onChange={(e) => updateTimeSlot(i, si, 'endTime', e.target.value)} />
                  {availDay.slots.length > 1 && (
                    <button onClick={() => setAvailability(prev => prev.map((day, di) => di === i ? { ...day, slots: day.slots.filter((_, s) => s !== si) } : day))} className="text-red-500"><X size={16} /></button>
                  )}
                </div>
              ))}
              <button onClick={() => setAvailability(prev => prev.map((day, di) => di === i ? { ...day, slots: [...day.slots, { startTime: '09:00', endTime: '17:00' }] } : day))} className="text-indigo-600 text-sm mt-2 flex items-center gap-1"><Plus size={16} /> Add Time Slot</button>
            </div>
          ))}
          <button onClick={addAvailabilityDay} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2">
            <Plus size={20} /> Add Day
          </button>
        </div>
      </div>

      {/* Image URL */}
      <Input label="Image URL" type="url" value={imageUrl} onChange={setImageUrl} placeholder="Optional profile image URL" />

      {/* Fees */}
      <Input label="Fees (INR)" required type="number" value={fees} onChange={setFees} placeholder="Consultation fees" min={0} />

      {/* Submit */}
      <button onClick={addDoctor} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-lg font-semibold mt-4">
        Add Doctor
      </button>
    </div>
  );
};

// Reusable Input component
interface InputProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
  min?: number;
}
const Input: React.FC<InputProps> = ({ label, required, type = 'text', value, onChange, placeholder, min }) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      min={min}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
    />
  </div>
);

export default AdminAddDoctor;
