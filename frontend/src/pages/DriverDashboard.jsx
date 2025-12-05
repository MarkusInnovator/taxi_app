import React, { useState, useEffect } from 'react';
import driverService from '../services/driverService';
import './Dashboard.css';

const DriverDashboard = () => {
  const [openRides, setOpenRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [open, my] = await Promise.all([
        driverService.getOpenRides(),
        driverService.getMyRides(),
      ]);
      setOpenRides(open.rides);
      setMyRides(my.rides);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (rideId) => {
    try {
      await driverService.acceptRide(rideId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept ride');
    }
  };

  const handleStart = async (rideId) => {
    try {
      await driverService.startRide(rideId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to start ride');
    }
  };

  const handleFinish = async (rideId) => {
    const finalPrice = prompt('Enter final price:');
    if (!finalPrice) return;

    try {
      await driverService.finishRide(rideId, parseFloat(finalPrice));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to finish ride');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      REQUESTED: 'badge-requested',
      ACCEPTED: 'badge-accepted',
      ONGOING: 'badge-ongoing',
      COMPLETED: 'badge-completed',
    };
    return <span className={`badge ${badges[status]}`}>{status}</span>;
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>🚗 Driver Dashboard</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          Open Rides ({openRides.length})
        </button>
        <button
          className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Rides ({myRides.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'open' && (
          <div className="rides-grid">
            {openRides.length === 0 ? (
              <p>No open rides available</p>
            ) : (
              openRides.map((ride) => (
                <div key={ride.id} className="ride-card">
                  <div className="ride-header">
                    <span>Ride #{ride.id}</span>
                    {getStatusBadge(ride.status)}
                  </div>
                  <p><strong>Customer:</strong> {ride.customer_name}</p>
                  <p><strong>Pickup:</strong> {ride.pickup_address}</p>
                  <p><strong>Drop-off:</strong> {ride.dropoff_address}</p>
                  {ride.estimated_price && <p><strong>Est. Price:</strong> ${ride.estimated_price}</p>}
                  <button onClick={() => handleAccept(ride.id)} className="btn-action">
                    Accept Ride
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div className="rides-grid">
            {myRides.length === 0 ? (
              <p>No rides yet</p>
            ) : (
              myRides.map((ride) => (
                <div key={ride.id} className="ride-card">
                  <div className="ride-header">
                    <span>Ride #{ride.id}</span>
                    {getStatusBadge(ride.status)}
                  </div>
                  <p><strong>Customer:</strong> {ride.customer_name}</p>
                  <p><strong>Pickup:</strong> {ride.pickup_address}</p>
                  <p><strong>Drop-off:</strong> {ride.dropoff_address}</p>
                  {ride.final_price && <p><strong>Final Price:</strong> ${ride.final_price}</p>}
                  
                  <div className="action-buttons">
                    {ride.status === 'ACCEPTED' && (
                      <button onClick={() => handleStart(ride.id)} className="btn-action">
                        Start Ride
                      </button>
                    )}
                    {ride.status === 'ONGOING' && (
                      <button onClick={() => handleFinish(ride.id)} className="btn-action">
                        Finish Ride
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
