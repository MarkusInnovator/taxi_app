import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { Booking } from '../models/Booking';
import { Driver } from '../models/Driver';
import { User } from '../models/User';
import { ApiResponse, BookingRequest } from '../types';
import { validateBooking } from '../utils/validation';
import { calculateFare, findNearbyDrivers } from '../utils/bookingHelpers';
import { io } from '../index';

const router = Router();

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { error } = validateBooking(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || 'Validation error',
      } as ApiResponse);
      return;
    }

    const bookingData = req.body as BookingRequest;
    const customerId = req.user._id;

    // Calculate estimated fare and distance
    const { estimatedFare, estimatedDistance, estimatedDuration } = await calculateFare(
      bookingData.pickupLocation,
      bookingData.dropoffLocation,
      bookingData.vehicleType
    );

    // Create booking
    const booking = new Booking({
      customerId,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      vehicleType: bookingData.vehicleType,
      scheduledAt: bookingData.scheduledAt,
      paymentMethod: bookingData.paymentMethod,
      notes: bookingData.notes,
      estimatedFare,
      estimatedDistance,
      estimatedDuration,
      timeline: {
        createdAt: new Date(),
      },
    });

    await booking.save();

    // Find nearby drivers
    const nearbyDrivers = await findNearbyDrivers(
      bookingData.pickupLocation.latitude,
      bookingData.pickupLocation.longitude,
      bookingData.vehicleType
    );

    // Notify nearby drivers
    nearbyDrivers.forEach((driver) => {
      io.to(`driver-${driver.userId}`).emit('new-booking-request', {
        bookingId: booking._id,
        pickup: bookingData.pickupLocation,
        dropoff: bookingData.dropoffLocation,
        estimatedFare,
        estimatedDistance,
        estimatedDuration,
      });
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    } as ApiResponse);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
    } as ApiResponse);
  }
});

// Get user's bookings
router.get('/my-bookings', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = {};
    
    if (req.user.role === 'customer') {
      query.customerId = userId;
    } else if (req.user.role === 'driver') {
      query.driverId = userId;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name phone profileImage')
      .populate('driverId', 'name phone profileImage')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: bookings.length,
          totalCount: total,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
    } as ApiResponse);
  }
});

// Get booking details
router.get('/:id', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name phone profileImage')
      .populate('driverId', 'name phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      } as ApiResponse);
    }

    // Check if user has access to this booking
    const hasAccess = (booking.customerId as any)._id.toString() === userId.toString() ||
                     (booking.driverId as any)?._id.toString() === userId.toString();

    if (!hasAccess && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Booking retrieved successfully',
      data: { booking },
    } as ApiResponse);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
    } as ApiResponse);
  }
});

// Accept booking (Driver only)
router.put('/:id/accept', authenticate, authorize('driver'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const driverId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      } as ApiResponse);
      return;
    }

    if (booking.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Booking is no longer available',
      } as ApiResponse);
      return;
    }

    // Update booking
    booking.driverId = driverId;
    booking.status = 'accepted';
    booking.timeline.acceptedAt = new Date();

    await booking.save();

    // Notify customer
    io.to(`customer-${booking.customerId}`).emit('booking-accepted', {
      bookingId: booking._id,
      driver: req.user,
    });

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      data: { booking },
    } as ApiResponse);
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking',
    } as ApiResponse);
  }
});

// Cancel booking
router.put('/:id/cancel', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      } as ApiResponse);
    }

    // Check if user can cancel this booking
    const canCancel = booking.customerId.toString() === userId.toString() ||
                     booking.driverId?.toString() === userId.toString();

    if (!canCancel && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking',
      } as ApiResponse);
    }

    // Update booking
    booking.status = 'cancelled';
    booking.timeline.cancelledAt = new Date();
    if (reason) booking.notes = reason;

    await booking.save();

    // Notify relevant parties
    if (booking.driverId) {
      io.to(`driver-${booking.driverId}`).emit('booking-cancelled', {
        bookingId: booking._id,
        reason,
      });
    }

    io.to(`customer-${booking.customerId}`).emit('booking-cancelled', {
      bookingId: booking._id,
      reason,
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    } as ApiResponse);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
    } as ApiResponse);
  }
});

export default router;