import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import BookRide from './pages/BookRide';
import MyRides from './pages/MyRides';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route
                path="/book"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <BookRide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-rides"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <MyRides />
                  </ProtectedRoute>
                }
              />

              {/* Driver Routes */}
              <Route
                path="/driver"
                element={
                  <ProtectedRoute allowedRoles={['DRIVER']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
