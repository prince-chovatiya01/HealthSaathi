// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { HealthSaathiProvider } from './context/HealthSaathiContext';
// import AppRoutes from './routes/AppRoutes';
// import Header from './components/layout/Header';
// import Footer from './components/layout/Footer';

// function App() {
//   return (
//     <HealthSaathiProvider>
//       <Router>
//         <div className="flex flex-col min-h-screen bg-slate-50">
//           <Header />
//           <main className="flex-grow">
//             <AppRoutes />
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </HealthSaathiProvider>
//   );
// }

// export default App;


// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import AppointmentsPage from './pages/AppointmentsPage';  // Import your appointments page

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginPage />} />
//       {/* Add your appointments route here */}
//       <Route path="/appointments" element={<AppointmentsPage />} />
//       {/* add other routes here */}
//     </Routes>
//   );
// };

// export default AppRoutes;


import AppRoutes from './routes/AppRoutes';

function App() {
  return <AppRoutes />;
}

export default App;
