import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './Dashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, ridesData, statsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllRides(),
        adminService.getStats(),
      ]);
      setUsers(usersData.users);
      setRides(ridesData.rides);
      setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = prompt(`Change role from ${currentRole} to (CUSTOMER/DRIVER/ADMIN):`);
    if (!newRole || !['CUSTOMER', 'DRIVER', 'ADMIN'].includes(newRole.toUpperCase())) {
      return alert('Invalid role');
    }

    try {
      await adminService.updateUserRole(userId, newRole.toUpperCase());
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminService.deleteUser(userId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>⚙️ Admin Dashboard</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`tab ${activeTab === 'rides' ? 'active' : ''}`}
          onClick={() => setActiveTab('rides')}
        >
          Rides ({rides.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Customers</h3>
              <p className="stat-number">{stats.usersByRole.customers}</p>
            </div>
            <div className="stat-card">
              <h3>Drivers</h3>
              <p className="stat-number">{stats.usersByRole.drivers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Rides</h3>
              <p className="stat-number">{stats.totalRides}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number">{stats.ridesByStatus.completed}</p>
            </div>
            <div className="stat-card">
              <h3>Ongoing</h3>
              <p className="stat-number">{stats.ridesByStatus.ongoing}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span></td>
                    <td>
                      <button onClick={() => handleRoleChange(user.id, user.role)} className="btn-small">
                        Change Role
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="btn-small btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Pickup</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id}>
                    <td>{ride.id}</td>
                    <td>{ride.customer_name}</td>
                    <td>{ride.driver_name || 'N/A'}</td>
                    <td><span className={`badge badge-${ride.status.toLowerCase()}`}>{ride.status}</span></td>
                    <td>{ride.pickup_address.substring(0, 30)}...</td>
                    <td>${ride.final_price || ride.estimated_price || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
