import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Calendar, Languages, DollarSign, ArrowLeft, Award, User, 
  Clock, Heart, Share2, Phone, Mail, CheckCircle, Badge
} from 'lucide-react';

interface Review {
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string[];
  availability: {
    day: string;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  imageUrl?: string;
  fees: number;
  rating: number;
  reviews: Review[];
}

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get<Doctor>(`http://localhost:3000/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Failed to fetch doctor', err);
        setError('Doctor not found or server error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-red-600 mb-4">{error || 'Doctor not found'}</p>
          <button onClick={() => navigate(-1)} className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full transition-all duration-300 ${
                liked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Doctor Profile Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
                <img
                  src={ doctor.imageUrl ||
                    `https://ui-avatars.com/api/?name=${doctor.name}&background=0D8ABC&color=fff&rounded=true`
                  }

                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {doctor.name}
                  </h1>
                  <Badge className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xl text-gray-600 font-medium">{doctor.specialization}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700"><strong>{doctor.experience}</strong> years experience</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <Languages className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700"><strong>₹{doctor.fees}</strong> consultation</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                    <Star className={`w-5 h-5 ${getRatingColor(doctor.rating)}`} />
                    <span className="text-gray-700">
                      <strong className={getRatingColor(doctor.rating)}>{doctor.rating.toFixed(1)}</strong> 
                      <span className="text-gray-500 ml-1">({doctor.reviews.length} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition">
                  <Mail className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Availability Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Availability</h2>
              </div>
              
              <div className="space-y-4">
                {doctor.availability.map((daySlot, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedDay === daySlot.day
                        ? 'bg-blue-50 border-blue-200 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedDay(selectedDay === daySlot.day ? '' : daySlot.day)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg text-gray-800">{daySlot.day}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {daySlot.slots.map((slot, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
                          >
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              </div>
              
              {doctor.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💭</div>
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {doctor.reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {review.user.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{review.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/book/${doctor._id}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Book Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;