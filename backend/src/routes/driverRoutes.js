import express from 'express';
import rideModel from '../models/rideModel.js';
import authMiddleware, { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require DRIVER role
router.use(authMiddleware);
router.use(requireRole('DRIVER'));

// Get all open/available rides
router.get('/rides/open', async (req, res) => {
  try {
    const rides = await rideModel.findOpenRides();
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Get open rides error:', error);
    res.status(500).json({ error: 'Failed to fetch open rides' });
  }
});

// Get driver's own rides
router.get('/rides/my', async (req, res) => {
  try {
    const rides = await rideModel.findByDriverId(req.user.id);
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Accept a ride
router.patch('/rides/:id/accept', async (req, res) => {
  try {
    const ride = await rideModel.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'REQUESTED') {
      return res.status(400).json({
        error: `Cannot accept ride with status: ${ride.status}`
      });
    }

    const updatedRide = await rideModel.updateStatus(req.params.id, 'ACCEPTED', {
      driverId: req.user.id
    });

    res.status(200).json({
      message: 'Ride accepted successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ error: 'Failed to accept ride' });
  }
});

// Start a ride
router.patch('/rides/:id/start', async (req, res) => {
  try {
    const ride = await rideModel.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if this driver owns the ride
    if (ride.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your ride' });
    }

    if (ride.status !== 'ACCEPTED') {
      return res.status(400).json({
        error: `Cannot start ride with status: ${ride.status}`,
        hint: 'Ride must be ACCEPTED first'
      });
    }

    const updatedRide = await rideModel.updateStatus(req.params.id, 'ONGOING');

    res.status(200).json({
      message: 'Ride started successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Start ride error:', error);
    res.status(500).json({ error: 'Failed to start ride' });
  }
});

// Finish/complete a ride
router.patch('/rides/:id/finish', async (req, res) => {
  try {
    const { finalPrice } = req.body;

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({
        error: 'Final price is required and must be greater than 0'
      });
    }

    const ride = await rideModel.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if this driver owns the ride
    if (ride.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your ride' });
    }

    if (ride.status !== 'ONGOING') {
      return res.status(400).json({
        error: `Cannot finish ride with status: ${ride.status}`,
        hint: 'Ride must be ONGOING'
      });
    }

    const updatedRide = await rideModel.updateStatus(req.params.id, 'COMPLETED', {
      finalPrice
    });

    res.status(200).json({
      message: 'Ride completed successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Finish ride error:', error);
    res.status(500).json({ error: 'Failed to complete ride' });
  }
});

export default router;
