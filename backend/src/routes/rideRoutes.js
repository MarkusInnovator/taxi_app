import express from 'express';
import rideModel from '../models/rideModel.js';
import authMiddleware, { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create new ride (CUSTOMER only)
router.post('/', requireRole('CUSTOMER'), async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, scheduledFor, estimatedPrice } = req.body;

    // Validation
    if (!pickupAddress || !dropoffAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['pickupAddress', 'dropoffAddress']
      });
    }

    const ride = await rideModel.create({
      customerId: req.user.id,
      pickupAddress,
      dropoffAddress,
      scheduledFor: scheduledFor || null,
      estimatedPrice: estimatedPrice || null
    });

    res.status(201).json({
      message: 'Ride created successfully',
      ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Failed to create ride' });
  }
});

// Get user's own rides
router.get('/my', async (req, res) => {
  try {
    const rides = await rideModel.findByCustomerId(req.user.id);
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Get specific ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await rideModel.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if user has permission to view this ride
    if (
      req.user.role === 'CUSTOMER' && ride.customer_id !== req.user.id ||
      req.user.role === 'DRIVER' && ride.driver_id !== req.user.id
    ) {
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Not your ride' });
      }
    }

    res.status(200).json({ ride });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ error: 'Failed to fetch ride' });
  }
});

// Cancel ride (CUSTOMER only, own rides only)
router.patch('/:id/cancel', requireRole('CUSTOMER'), async (req, res) => {
  try {
    const ride = await rideModel.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check ownership
    if (ride.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your ride' });
    }

    // Check if ride can be cancelled
    if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
      return res.status(400).json({
        error: `Cannot cancel ride with status: ${ride.status}`
      });
    }

    const updatedRide = await rideModel.cancel(req.params.id);

    res.status(200).json({
      message: 'Ride cancelled successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
});

export default router;
