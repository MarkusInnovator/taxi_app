import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚕 TaxiFlow
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">
                {user.name} ({user.role})
              </span>
              
              {user.role === 'CUSTOMER' && (
                <>
                  <Link to="/book" className="navbar-link">Book Ride</Link>
                  <Link to="/my-rides" className="navbar-link">My Rides</Link>
                </>
              )}
              
              {user.role === 'DRIVER' && (
                <Link to="/driver" className="navbar-link">Dashboard</Link>
              )}
              
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="navbar-link">Admin Panel</Link>
              )}
              
              <button onClick={logout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
