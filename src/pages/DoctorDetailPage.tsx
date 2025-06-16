import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Calendar, Languages, DollarSign,
  ArrowLeft, Award, User
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
    return <div className="text-center mt-10 text-lg">Loading doctor details...</div>;
  }

  if (error || !doctor) {
    return <div className="text-center mt-10 text-red-600">{error || 'Doctor not found'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        <img
          src={doctor.imageUrl || '/default-doctor.png'}
          alt={doctor.name}
          className="w-48 h-48 object-cover rounded-full border shadow"
        />

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-semibold">{doctor.name}</h1>
          <div className="text-gray-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            {doctor.specialization}
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {doctor.experience} years experience
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <Languages className="w-4 h-4" />
            {doctor.languages.join(', ')}
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            ₹{doctor.fees} consultation fee
          </div>
          <div className="text-yellow-500 flex items-center gap-1">
            <Star className="w-4 h-4" />
            {doctor.rating.toFixed(1)} ({doctor.reviews.length} reviews)
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Availability</h2>
        <div className="grid gap-4">
          {doctor.availability.map((daySlot, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 shadow flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Calendar className="w-4 h-4" />
                {daySlot.day}
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {daySlot.slots.map((slot, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {slot.startTime} - {slot.endTime}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {doctor.reviews.length === 0 ? (
          <div className="text-gray-500">No reviews yet.</div>
        ) : (
          <div className="space-y-4">
            {doctor.reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{review.user.name}</div>
                  <div className="text-yellow-500 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {review.rating.toFixed(1)}
                  </div>
                </div>
                <div className="text-gray-600 mt-1">{review.comment}</div>
                <div className="text-gray-400 text-sm mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(`/book/${doctor._id}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
