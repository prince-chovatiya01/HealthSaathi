import React from 'react';

const WellnessPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wellness Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mental Health</h2>
          <p className="text-gray-600">Access resources and support for your mental well-being.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Physical Fitness</h2>
          <p className="text-gray-600">Discover exercise routines and fitness tracking tools.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Nutrition</h2>
          <p className="text-gray-600">Get personalized diet plans and nutritional guidance.</p>
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;