import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚕 TaxiFlow
        </Link>

        <ul className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li>
                <Link to="/register" className="navbar-link">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-user">
                👤 {user?.name} ({user?.role})
              </li>

              {user?.role === 'CUSTOMER' && (
                <>
                  <li>
                    <Link to="/book" className="navbar-link">Book Ride</Link>
                  </li>
                  <li>
                    <Link to="/my-rides" className="navbar-link">My Rides</Link>
                  </li>
                </>
              )}

              {user?.role === 'DRIVER' && (
                <li>
                  <Link to="/driver" className="navbar-link">Driver Dashboard</Link>
                </li>
              )}

              {user?.role === 'ADMIN' && (
                <li>
                  <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="navbar-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
