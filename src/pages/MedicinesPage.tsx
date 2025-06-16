import React from 'react';

const MedicinesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Medicines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder content - to be implemented */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Prescriptions</h2>
          <p className="text-gray-600">No active prescriptions found.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Medicine Reminders</h2>
          <p className="text-gray-600">No medicine reminders set.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <p className="text-gray-600">No previous orders found.</p>
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;