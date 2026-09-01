import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Stethoscope } from 'lucide-react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import PageNav from '../components/common/PageNav';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const DoctorRatingPage: React.FC = () => {
  const location = useLocation();
  const { user } = useHealthSaathi();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const navigationData = location?.state;

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        setFetchLoading(true);
        if (navigationData?.appointmentId && navigationData?.doctorId) {
          const mock = {
            _id: navigationData.appointmentId,
            doctor: { name: navigationData.doctorName || 'Doctor', specialization: '' },
            doctorId: navigationData.doctorId,
            date: navigationData.appointmentDate || new Date().toISOString().split('T')[0],
            time: '00:00', hasRated: false,
          };
          setAppointments([mock]);
          setSelectedAppointment(mock);
          return;
        }
        const res = await axiosInstance.get('/appointments/completed');
        const list = res.data.appointments || [];
        setAppointments(list);
        if (navigationData?.appointmentId) {
          const apt = list.find((a: any) => a._id === navigationData.appointmentId);
          if (apt && !apt.hasRated) setSelectedAppointment(apt);
        }
      } catch (err: any) {
        setError('Failed to load appointments');
        if (navigationData?.appointmentId && navigationData?.doctorId) {
          const mock = { _id: navigationData.appointmentId, doctor: { name: navigationData.doctorName || 'Doctor', specialization: '' }, doctorId: navigationData.doctorId, date: new Date().toISOString().split('T')[0], time: '00:00', hasRated: false };
          setAppointments([mock]); setSelectedAppointment(mock);
        }
      } finally { setFetchLoading(false); }
    };
    fetch();
  }, [location?.state, user]);

  if (!user) return <Navigate to="/login" />;

  const submitRating = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setLoading(true); setError('');
    try {
      const doctorId = typeof selectedAppointment.doctorId === 'string'
        ? selectedAppointment.doctorId
        : selectedAppointment.doctorId?._id || selectedAppointment.doctor?._id;
      if (!doctorId) throw new Error('Doctor ID not found');
      const res = await axiosInstance.post('/ratings/submit', { doctor_id: doctorId, appointment_id: selectedAppointment._id, rating, review: review.trim() });
      if (res.data.success) {
        setSuccessMessage('Thank you for your feedback!');
        setAppointments(prev => prev.map(a => a._id === selectedAppointment._id ? { ...a, hasRated: true, userRating: rating, userReview: review } : a));
        setTimeout(() => navigate('/appointments'), 2500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally { setLoading(false); }
  };

  const unrated = appointments.filter(a => !a.hasRated && a.status !== 'cancelled');
  const rated = appointments.filter(a => a.hasRated);

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-2xl">
        <PageNav />

        <div className="mb-8">
          <h1 className="hs-page-title">Rate Your Visit</h1>
          <p className="text-slate-500 mt-1">Help others by sharing your experience</p>
        </div>

        {/* Rating form */}
        {selectedAppointment ? (
          <div className="hs-card p-8">
            {successMessage ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
                <p className="text-slate-500">{successMessage}</p>
                <p className="text-sm text-slate-400 mt-2">Redirecting...</p>
              </div>
            ) : (
              <>
                {/* Doctor */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                  <div className="w-12 h-12 gradient-health rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selectedAppointment.doctor?.name}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {error && <div className="hs-alert-error mb-4"><span>⚠️</span><span>{error}</span></div>}

                {/* Stars */}
                <div className="text-center mb-6">
                  <p className="font-semibold text-slate-700 mb-4">How would you rate your experience?</p>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none">
                        <Star className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                  {(hoverRating || rating) > 0 && (
                    <p className="text-sm font-medium text-amber-600">{LABELS[hoverRating || rating]}</p>
                  )}
                </div>

                {/* Review */}
                <div className="mb-6">
                  <label className="hs-label">Write a Review <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea value={review} onChange={e => setReview(e.target.value)} rows={4}
                    className="hs-input resize-none"
                    placeholder="Share your experience with this doctor — what went well, what could be improved..." />
                </div>

                <button onClick={submitRating} disabled={loading || !rating}
                  className="btn-primary w-full justify-center text-base py-3">
                  {loading
                    ? <span className="flex items-center gap-2"><span className="hs-spinner w-4 h-4" />Submitting...</span>
                    : <span className="flex items-center gap-2"><Star className="w-4 h-4" />Submit Review</span>}
                </button>
              </>
            )}
          </div>
        ) : fetchLoading ? (
          <div className="flex justify-center py-20"><div className="hs-spinner w-10 h-10" /></div>
        ) : (
          <div className="space-y-6">
            {/* Unrated appointments */}
            {unrated.length > 0 && (
              <div className="hs-card p-6">
                <h2 className="hs-section-title mb-4">Visits Awaiting Review</h2>
                <div className="space-y-3">
                  {unrated.map(a => (
                    <div key={a._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 transition-colors">
                      <div className="w-10 h-10 gradient-health rounded-xl flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{a.doctor?.name}</p>
                        <p className="text-sm text-slate-500">{new Date(a.date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => { setSelectedAppointment(a); setRating(0); setReview(''); setError(''); }}
                        className="btn-primary btn-sm">Rate Visit</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rated.length > 0 && (
              <div className="hs-card p-6">
                <h2 className="hs-section-title mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Already Reviewed
                </h2>
                <div className="space-y-3">
                  {rated.map(a => (
                    <div key={a._id} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{a.doctor?.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= (a.userRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unrated.length === 0 && rated.length === 0 && (
              <div className="hs-card p-16 text-center">
                <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No completed appointments to review yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRatingPage;
