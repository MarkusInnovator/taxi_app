import React, { useState, useEffect } from 'react';
import rideService from '../services/rideService';
import './MyRides.css';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const data = await rideService.getMyRides();
      setRides(data.rides || []);
    } catch (err) {
      setError('Failed to load rides');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) {
      return;
    }

    try {
      await rideService.cancelRide(rideId);
      fetchRides(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel ride');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      REQUESTED: { class: 'badge-requested', text: 'Requested' },
      ACCEPTED: { class: 'badge-accepted', text: 'Accepted' },
      ONGOING: { class: 'badge-ongoing', text: 'Ongoing' },
      COMPLETED: { class: 'badge-completed', text: 'Completed' },
      CANCELLED: { class: 'badge-cancelled', text: 'Cancelled' },
    };
    const badge = badges[status] || { class: '', text: status };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2>🚕 My Rides</h2>

      {rides.length === 0 ? (
        <p>No rides yet. <a href="/book">Book your first ride!</a></p>
      ) : (
        <div className="rides-grid">
          {rides.map((ride) => (
            <div key={ride.id} className="ride-card">
              <div className="ride-header">
                <span className="ride-id">Ride #{ride.id}</span>
                {getStatusBadge(ride.status)}
              </div>

              <div className="ride-details">
                <p><strong>📍 Pickup:</strong> {ride.pickup_address}</p>
                <p><strong>📌 Drop-off:</strong> {ride.dropoff_address}</p>
                {ride.driver_name && (
                  <p><strong>👤 Driver:</strong> {ride.driver_name}</p>
                )}
                {ride.estimated_price && (
                  <p><strong>💰 Estimated:</strong> ${ride.estimated_price}</p>
                )}
                {ride.final_price && (
                  <p><strong>💵 Final Price:</strong> ${ride.final_price}</p>
                )}
                <p className="ride-date">
                  {new Date(ride.created_at).toLocaleString()}
                </p>
              </div>

              {ride.status === 'REQUESTED' && (
                <button
                  onClick={() => handleCancel(ride.id)}
                  className="btn-cancel"
                >
                  Cancel Ride
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;
