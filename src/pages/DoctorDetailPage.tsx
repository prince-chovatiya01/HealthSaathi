import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import ChatWindow from '../components/chat/ChatWindow';
import PageNav from '../components/common/PageNav';
import { Star, Calendar, Clock, User, MessageCircle, Stethoscope, Award, Globe, IndianRupee, CheckCircle } from 'lucide-react';

interface Review { user: { name: string }; rating: number; comment: string; date: string; }
interface Doctor {
  _id: string; name: string; specialization: string; experience: number;
  languages: string[]; availability: { day: string; slots: { startTime: string; endTime: string }[] }[];
  imageUrl?: string; fees: number; rating: number; reviews: Review[];
}

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) => {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
};

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useHealthSaathi();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<Doctor>(`/doctors/${id}`);
        setDoctor(data);
        if (data.availability?.length) setSelectedDay(data.availability[0].day);
      } catch { setError('Doctor not found or server error'); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="hs-spinner w-10 h-10" /></div>;
  if (error || !doctor) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><p className="text-slate-500 mb-4">{error || 'Doctor not found'}</p>
        <button onClick={() => navigate('/doctors')} className="btn-outline btn-sm">Back to Doctors</button></div>
    </div>
  );

  const selectedAvailability = doctor.availability?.find(a => a.day === selectedDay);

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-5xl">
        <PageNav />

        {/* Hero card */}
        <div className="hs-card mb-6 overflow-hidden">
          <div className="h-3 gradient-health" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-28 h-28 rounded-3xl gradient-health flex items-center justify-center flex-shrink-0 shadow-md mx-auto sm:mx-0">
                <Stethoscope className="w-14 h-14 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{doctor.name}</h1>
                <p className="text-primary-600 font-semibold mb-2">{doctor.specialization}</p>
                <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <StarRating rating={doctor.rating} />
                  <span className="font-semibold text-slate-800">{doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}</span>
                  <span className="text-slate-400 text-sm">({doctor.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="badge-blue">{doctor.experience}+ Years Experience</span>
                  {doctor.languages?.slice(0, 2).map(l => (
                    <span key={l} className="badge-gray">{l}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end gap-3">
                <div className="text-center sm:text-right">
                  <p className="text-3xl font-bold text-slate-900">₹{doctor.fees}</p>
                  <p className="text-sm text-slate-500">Consultation fee</p>
                </div>
                <Link to={`/book/${doctor._id}`} className="btn-primary w-full sm:w-auto justify-center">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <button onClick={() => setShowChat(!showChat)} className="btn-outline btn-sm w-full sm:w-auto justify-center">
                  <MessageCircle className="w-4 h-4" /> {showChat ? 'Hide' : 'Chat'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Availability */}
            {doctor.availability?.length > 0 && (
              <div className="hs-card p-6">
                <h2 className="hs-section-title flex items-center gap-2 mb-5">
                  <Clock className="w-5 h-5 text-primary-600" /> Availability Schedule
                </h2>
                <div className="flex flex-wrap gap-2 mb-5">
                  {doctor.availability.map(a => (
                    <button key={a.day} onClick={() => setSelectedDay(a.day)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedDay === a.day ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                      }`}>
                      {a.day}
                    </button>
                  ))}
                </div>
                {selectedAvailability?.slots?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedAvailability.slots.map((slot, i) => (
                      <div key={i} className="bg-teal-50 border border-teal-200 text-teal-700 rounded-xl px-3 py-2 text-center text-sm font-medium">
                        {slot.startTime} – {slot.endTime}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-400 text-sm">No slots for this day</p>}
              </div>
            )}

            {/* Reviews */}
            <div className="hs-card p-6">
              <h2 className="hs-section-title flex items-center gap-2 mb-5">
                <Star className="w-5 h-5 text-amber-500" /> Patient Reviews
              </h2>
              {doctor.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {doctor.reviews.map((r, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{r.user?.name || 'Patient'}</p>
                            <StarRating rating={r.rating} size="sm" />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                      {r.comment && <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="hs-card p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Doctor Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-primary-500" />
                  <span className="text-slate-600">{doctor.experience} years experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary-500 mt-0.5" />
                  <span className="text-slate-600">{doctor.languages?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-700 font-medium">Verified Doctor</span>
                </div>
              </div>
            </div>

            <Link to={`/book/${doctor._id}`} className="btn-primary w-full justify-center">
              <Calendar className="w-4 h-4" /> Book Now
            </Link>
          </div>
        </div>

        {/* Chat */}
        {showChat && user && (
          <div className="mt-6 hs-card overflow-hidden">
            <div className="bg-primary-600 text-white px-5 py-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Chat with Support</span>
            </div>
            <ChatWindow userId={user._id} doctorId={doctor._id} doctorName={doctor.name} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailPage;