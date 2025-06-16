// import React from 'react';

// const DoctorsPage = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>
      
//       {/* Search and filter section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Search by name or specialty"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option value="">Select Specialty</option>
//             <option value="cardiology">Cardiology</option>
//             <option value="dermatology">Dermatology</option>
//             <option value="neurology">Neurology</option>
//             <option value="pediatrics">Pediatrics</option>
//           </select>
//           <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option value="">Available Time</option>
//             <option value="morning">Morning</option>
//             <option value="afternoon">Afternoon</option>
//             <option value="evening">Evening</option>
//           </select>
//         </div>
//       </div>

//       {/* Doctors list */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Sample doctor cards - in a real app, this would be mapped from actual data */}
//         {[1, 2, 3].map((index) => (
//           <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900">Dr. Sarah Johnson</h3>
//                   <p className="text-gray-600">Cardiologist</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <p className="text-gray-600">⭐ 4.8 (120 reviews)</p>
//                 <p className="text-gray-600">10+ years experience</p>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-blue-600 font-semibold">₹1000/consultation</span>
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
//                   Book Appointment
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorsPage;



import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, Award, ChevronRight, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

interface Availability {
  day: string;       // "Monday", "Tuesday", etc.
  slots: Slot[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string[];
  availability?: Availability[];
  imageUrl?: string;
  fees: number;
  rating?: number;
  reviews?: any[]; // You can create a `Review` interface if needed
}

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const queryParams = [];
      if (specialty) queryParams.push(`specialization=${specialty}`);
      const query = queryParams.length ? `?${queryParams.join('&')}` : '';

      // Updated route for your backend structure
      const response = await fetch(`http://localhost:3000/api/doctors${query}`);
      const data = await response.json();
      setDoctors(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setDoctors([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  // Search filter
  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(term) ||
      doc.specialization.toLowerCase().includes(term)
    );
  });

  // Availability filter (client-side only)
  const finalFilteredDoctors = availability
    ? filteredDoctors.filter((doc) =>
        doc.availability?.some((a: Availability) =>
          a.slots?.some((slot: Slot) => {
            const start = slot.startTime;
            const end = slot.endTime;
            if (availability === 'morning') return start >= '06:00' && end <= '12:00';
            if (availability === 'afternoon') return start >= '12:00' && end <= '17:00';
            if (availability === 'evening') return start >= '17:00' && end <= '21:00';
            return false;
          })
        )
      )
    : filteredDoctors;

  const getSpecialtyIcon = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case 'cardiology': return <Heart className="w-5 h-5 text-red-500" />;
      case 'neurology': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAvailabilityBadge = () => {
    const badges = ['Available Today', 'Next Available', 'Online Consultation'];
    return badges[Math.floor(Math.random() * badges.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Find Your Perfect Doctor
            </h1>
            <p className="text-gray-600 text-lg">Connect with experienced healthcare professionals</p>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
              
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">All Time Slots</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : finalFilteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || specialty || availability ? 'No doctors found' : 'No doctors available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || specialty || availability 
                  ? 'Try adjusting your search criteria or filters'
                  : 'There are currently no doctors registered in the system'
                }
              </p>
              {(searchTerm || specialty || availability) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSpecialty('');
                    setAvailability('');
                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {finalFilteredDoctors.length} Doctor{finalFilteredDoctors.length !== 1 ? 's' : ''} Available
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredDoctors.map((doctor) => (
                <div 
                  key={doctor._id} 
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  {/* Availability Badge */}
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                        {getAvailabilityBadge()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Doctor Info */}
                    <div className="flex items-start mb-6">
                      <div className="relative">
                        <img
                          src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${doctor.name}&background=0D8ABC&color=fff&rounded=true`}
                          // https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}&backgroundColor=b6e3f4,c0aede,d1d4f9
                          alt={doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full">
                          {getSpecialtyIcon(doctor.specialization)}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                        <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                        {doctor.rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">{doctor.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-500 text-sm">({doctor.reviews?.length || 0} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{doctor.experience}+ years experience</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Languages: {doctor.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">₹{doctor.fees}</p>
                        <p className="text-sm text-gray-500">per consultation</p>
                      </div>
                      <Link to={`/doctors/${doctor._id}`}>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 group-hover:shadow-lg">
                          Book Now
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;