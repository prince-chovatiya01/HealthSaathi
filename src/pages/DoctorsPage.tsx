import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Award, ChevronRight, Heart, Zap, Stethoscope, Filter, X, MapPin, IndianRupee } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface Slot { startTime: string; endTime: string; }
interface Availability { day: string; slots: Slot[]; }
interface Doctor {
  _id: string; name: string; specialization: string; experience: number;
  languages: string[]; availability?: Availability[]; imageUrl?: string;
  fees: number; rating?: number; reviewCount?: number;
}

const SPECIALTIES = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'General Medicine'];
const SPEC_COLORS: Record<string, string> = {
  cardiology: 'bg-red-100 text-red-700',
  dermatology: 'bg-pink-100 text-pink-700',
  neurology: 'bg-purple-100 text-purple-700',
  pediatrics: 'bg-blue-100 text-blue-700',
  orthopedics: 'bg-amber-100 text-amber-700',
  gynecology: 'bg-rose-100 text-rose-700',
  default: 'bg-teal-100 text-teal-700',
};

const getSpecColor = (s: string) => SPEC_COLORS[s.toLowerCase()] || SPEC_COLORS.default;

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
    ))}
    <span className="text-xs font-medium text-slate-600 ml-0.5">{rating > 0 ? rating.toFixed(1) : '–'}</span>
  </div>
);

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, string> = {};
        if (specialty) params.specialization = specialty;
        const { data } = await axiosInstance.get('/doctors', { params });
        setDoctors(Array.isArray(data) ? data : []);
      } catch { setDoctors([]); } finally { setIsLoading(false); }
    };
    fetch();
  }, [specialty]);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-6xl">
        <PageNav />

        {/* Header */}
        <div className="mb-8">
          <h1 className="hs-page-title mb-1">Find a Doctor</h1>
          <p className="text-slate-500">Connect with experienced healthcare professionals</p>
        </div>

        {/* Search + Filter bar */}
        <div className="hs-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="hs-input pl-10 py-2.5"
              placeholder="Search by name or specialty..."
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="hs-select py-2.5 sm:w-52">
            <option value="">All Specialties</option>
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {specialty && (
            <button onClick={() => setSpecialty('')} className="btn-ghost btn-sm whitespace-nowrap">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">
          {isLoading ? 'Loading...' : `${filtered.length} doctor${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Doctor cards */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="hs-spinner w-10 h-10" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="hs-card p-16 text-center">
            <Stethoscope className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchTerm(''); setSpecialty(''); }} className="btn-outline btn-sm mt-4">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(doc => (
              <div key={doc._id} className="hs-card hover:shadow-card-md transition-shadow duration-200 group overflow-hidden">
                <div className="p-5">
                  {/* Doctor header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Stethoscope className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg truncate">{doc.name}</h3>
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5 ${getSpecColor(doc.specialization)}`}>
                        {doc.specialization}
                      </span>
                      <div className="mt-1.5">
                        <StarRating rating={doc.rating || 0} />
                        {(doc.reviewCount ?? 0) > 0 && <span className="text-xs text-slate-400 ml-1">({doc.reviewCount} reviews)</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-lg font-bold text-primary-700">{doc.experience}+</p>
                      <p className="text-xs text-slate-500">Yrs Exp</p>
                    </div>
                    <div className="text-center p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-lg font-bold text-teal-700">₹{doc.fees}</p>
                      <p className="text-xs text-slate-500">Consult Fee</p>
                    </div>
                    <div className="text-center p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-lg font-bold text-slate-700">{doc.languages?.length || 1}</p>
                      <p className="text-xs text-slate-500">Languages</p>
                    </div>
                  </div>

                  {/* Languages */}
                  {doc.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {doc.languages.slice(0, 3).map(l => (
                        <span key={l} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Link to={`/doctors/${doc._id}`} className="btn-ghost btn-sm flex-1 justify-center text-slate-600">
                      View Profile
                    </Link>
                    <Link to={`/book/${doc._id}`} className="btn-primary btn-sm flex-1 justify-center">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
