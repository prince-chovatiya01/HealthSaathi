import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useHealthSaathi } from '../context/HealthSaathiContext';

const DoctorRatingPage: React.FC = () => {
  const location = useLocation();
  const { user } = useHealthSaathi();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Get data from navigation state if available
  const navigationData = location?.state;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setFetchLoading(true);
        setError('');

        // If we have navigation data, use it directly and skip API call
        if (navigationData?.appointmentId && navigationData?.doctorId) {
          const mockAppointment = {
            _id: navigationData.appointmentId,
            doctor: {
              name: navigationData.doctorName || 'Doctor',
              specialization: navigationData.doctorSpecialization || 'General'
            },
            doctorId: navigationData.doctorId,
            date: navigationData.appointmentDate || new Date().toISOString().split('T')[0],
            time: navigationData.appointmentTime || '00:00',
            hasRated: false
          };

          setAppointments([mockAppointment]);
          setSelectedAppointment(mockAppointment);
          setShowRatingModal(true);
          setFetchLoading(false);
          return;
        }

        // Fallback to API call if no navigation data
        const res = await axiosInstance.get('/appointments/completed');
        const completedAppointments = res.data.appointments || [];

        setAppointments(completedAppointments);

        const appointmentId = navigationData?.appointmentId;
        if (appointmentId) {
          const apt = completedAppointments.find((a: any) => a._id === appointmentId);
          if (apt && !apt.hasRated) {
            setSelectedAppointment(apt);
            setShowRatingModal(true);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch appointments', err);
        setError('Failed to load appointments. Please try again.');
        
        // If we have navigation data, still try to show the rating modal
        if (navigationData?.appointmentId && navigationData?.doctorId) {
          const mockAppointment = {
            _id: navigationData.appointmentId,
            doctor: {
              name: navigationData.doctorName || 'Doctor',
              specialization: navigationData.doctorSpecialization || 'General'
            },
            doctorId: navigationData.doctorId,
            date: navigationData.appointmentDate || new Date().toISOString().split('T')[0],
            time: navigationData.appointmentTime || '00:00',
            hasRated: false
          };

          setAppointments([mockAppointment]);
          setSelectedAppointment(mockAppointment);
          setShowRatingModal(true);
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [location?.state, user, navigationData]);

  if (!user) return <Navigate to="/login" />;

  const openRatingModal = (apt: any) => {
    setSelectedAppointment(apt);
    setShowRatingModal(true);
    setRating(0);
    setReview('');
    setSuccessMessage('');
    setError('');
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedAppointment(null);
    setSuccessMessage('');
    setError('');
  };

  const handleStarClick = (star: number) => setRating(star);

  const submitRating = async () => {
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const doctorId = typeof selectedAppointment.doctorId === 'string'
        ? selectedAppointment.doctorId
        : selectedAppointment.doctorId?._id || selectedAppointment.doctor?._id;

      if (!doctorId) {
        throw new Error('Doctor ID not found');
      }

      const res = await axiosInstance.post('/ratings/submit', {
        doctor_id: doctorId,
        appointment_id: selectedAppointment._id,
        rating,
        review: review.trim()
      });

      const data = res.data;

      if (data.success) {
        setAppointments(prev =>
          prev.map(apt =>
            apt._id === selectedAppointment._id
              ? { ...apt, hasRated: true, userRating: rating, userReview: review }
              : apt
          )
        );
        setSuccessMessage('Thank you for your feedback!');
        setTimeout(() => {
          closeRatingModal();
          // Navigate back to appointments page after successful rating
          window.history.back();
        }, 2000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err: any) {
      console.error('Rating error', err);
      setError(err.response?.data?.message || 'Error submitting rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange }: any) => (
    <div className="flex space-x-1 justify-center">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <Star
            className={`w-8 h-8 transition-colors duration-200 ${
              star <= (hoverRating || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/appointments" className="mr-4">
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Rate Your Doctors</h1>
        </div>

        {error && !showRatingModal && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {appointments.length === 0 && !fetchLoading ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No completed appointments available for rating.
            </p>
            <Link to="/appointments" className="inline-block mt-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View All Appointments
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{apt.doctor?.name}</h3>
                    <p className="text-gray-600">{apt.doctor?.specialization}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {new Date(apt.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} at {apt.time}
                    </p>
                  </div>

                  {apt.hasRated ? (
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-1 justify-end">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= apt.userRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-green-600 flex items-center justify-end">
                        <CheckCircle className="w-4 h-4 mr-1" /> Rated
                      </p>
                      {apt.userReview && (
                        <p className="text-sm italic text-right text-gray-600 max-w-xs">
                          "{apt.userReview}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => openRatingModal(apt)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" /> Rate Doctor
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showRatingModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-center">
                Rate Dr. {selectedAppointment?.doctor?.name}
              </h2>

              {successMessage ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-600 text-lg">{successMessage}</p>
                  <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600 text-center mb-4">How was your experience?</p>
                    <StarRating value={rating} onChange={handleStarClick} />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share your experience (optional)
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Tell others about your experience with the doctor..."
                      rows={4}
                      maxLength={500}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{review.length}/500 characters</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeRatingModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitRating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={loading || rating === 0}
                    >
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRatingPage;
