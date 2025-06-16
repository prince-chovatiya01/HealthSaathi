import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import SymptomCheckerPage from '../pages/SymptomCheckerPage';
import DoctorsPage from '../pages/DoctorsPage';
import DoctorDetailPage from '../pages/DoctorDetailPage';
import AppointmentsPage from '../pages/AppointmentsPage';
import HealthRecordsPage from '../pages/HealthRecordsPage';
import MedicinesPage from '../pages/MedicinesPage';
import WellnessPage from '../pages/WellnessPage';
import ProfilePage from '../pages/ProfilePage';
import AdminAddDoctor from '../components/AdminAddDoctor';
import SignupPage from '../pages/SignupPage';
import AppointmentForm from '../pages/AppointmentForm';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useHealthSaathi();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/symptom-checker" element={
        <ProtectedRoute>
          <SymptomCheckerPage />
        </ProtectedRoute>
      } />
      
      <Route path="/doctors" element={
        <ProtectedRoute>
          <DoctorsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/doctors/:id" element={
        <ProtectedRoute>
          <DoctorDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/add-doctor" element={
          <ProtectedRoute>
            <AdminAddDoctor />
          </ProtectedRoute>
        }/>

      <Route path="/appointments" element={
        <ProtectedRoute>
          <AppointmentsPage />
        </ProtectedRoute>
      } />

      <Route path="/book/:id" element={<AppointmentForm />} />

      <Route path="/health-records" element={
        <ProtectedRoute>
          <HealthRecordsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/medicines" element={
        <ProtectedRoute>
          <MedicinesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/wellness" element={
        <ProtectedRoute>
          <WellnessPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      {/* <Route path="*" element={<Navigate to="/\" replace />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;