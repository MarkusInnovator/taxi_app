import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/rideService';
import './BookRide.css';

const BookRide = () => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    scheduledFor: '',
    estimatedPrice: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const rideData = {
        pickupAddress: formData.pickupAddress,
        dropoffAddress: formData.dropoffAddress,
        scheduledFor: formData.scheduledFor || null,
        estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
      };

      await rideService.createRide(rideData);
      setSuccess('Ride booked successfully!');
      
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-ride-container">
      <div className="book-ride-box">
        <h2>🚕 Book a Ride</h2>

        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pickupAddress">Pickup Address *</label>
            <input
              type="text"
              id="pickupAddress"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
              placeholder="123 Main St, City"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dropoffAddress">Drop-off Address *</label>
            <input
              type="text"
              id="dropoffAddress"
              name="dropoffAddress"
              value={formData.dropoffAddress}
              onChange={handleChange}
              required
              placeholder="456 Oak Ave, City"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scheduledFor">Scheduled Time (Optional)</label>
            <input
              type="datetime-local"
              id="scheduledFor"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedPrice">Estimated Price (Optional)</label>
            <input
              type="number"
              step="0.01"
              id="estimatedPrice"
              name="estimatedPrice"
              value={formData.estimatedPrice}
              onChange={handleChange}
              placeholder="25.00"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Booking...' : 'Book Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRide;
