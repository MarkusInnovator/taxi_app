import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="landing">
      <div className="landing-hero">
        <h1>🚕 Welcome to TaxiFlow</h1>
        <p className="landing-subtitle">
          Your reliable taxi booking solution
        </p>

        {!isAuthenticated ? (
          <div className="landing-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="landing-actions">
            <p className="welcome-message">Welcome back, {user?.name}!</p>
            {user?.role === 'CUSTOMER' && (
              <Link to="/book" className="btn btn-primary">
                Book a Ride
              </Link>
            )}
            {user?.role === 'DRIVER' && (
              <Link to="/driver" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="btn btn-primary">
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="landing-features">
        <div className="feature">
          <span className="feature-icon">🚗</span>
          <h3>Easy Booking</h3>
          <p>Book your ride in just a few clicks</p>
        </div>
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <h3>Fast Service</h3>
          <p>Get matched with drivers quickly</p>
        </div>
        <div className="feature">
          <span className="feature-icon">💰</span>
          <h3>Fair Pricing</h3>
          <p>Transparent and competitive rates</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <h3>Safe & Secure</h3>
          <p>Your safety is our priority</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
