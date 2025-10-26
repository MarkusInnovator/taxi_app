import { Router } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { Driver } from '../models/Driver';
import { User } from '../models/User';
import { ApiResponse } from '../types';
import { validateDriverProfile, validateLocationUpdate } from '../utils/validation';

const router = Router();

// Get driver profile
router.get('/profile', authenticate, authorize('driver'), async (req: AuthRequest, res: any) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone profileImage');
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Driver profile retrieved successfully',
      data: { driver },
    } as ApiResponse);
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve driver profile',
    } as ApiResponse);
  }
});

// Update driver profile
router.put('/profile', authenticate, authorize('driver'), async (req: AuthRequest, res: any) => {
  try {
    const { error } = validateDriverProfile(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || 'Validation error',
      } as ApiResponse);
    }

    const driver = await Driver.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone profileImage');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Driver profile updated successfully',
      data: { driver },
    } as ApiResponse);
  } catch (error) {
    console.error('Update driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update driver profile',
    } as ApiResponse);
  }
});

// Update driver location
router.put('/location', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const { error } = validateLocationUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || 'Validation error',
      } as ApiResponse);
    }

    const { latitude, longitude, heading, speed } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { userId: req.user._id },
      {
        currentLocation: {
          latitude,
          longitude,
          heading,
          speed,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { location: driver.currentLocation },
    } as ApiResponse);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
    } as ApiResponse);
  }
});

// Toggle online status
router.put('/status', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const { isOnline } = req.body;

    if (typeof isOnline !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isOnline must be a boolean value',
      } as ApiResponse);
    }

    const driver = await Driver.findOneAndUpdate(
      { userId: req.user._id },
      { isOnline },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      data: { isOnline: driver.isOnline },
    } as ApiResponse);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    } as ApiResponse);
  }
});

// Get driver earnings
router.get('/earnings', authenticate, authorize('driver'), async (req: AuthRequest, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id }).select('earnings totalRides');
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Earnings retrieved successfully',
      data: { 
        earnings: driver.earnings,
        totalRides: driver.totalRides,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve earnings',
    } as ApiResponse);
  }
});

// Get all drivers (Admin only)
router.get('/', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, isOnline, isVerified } = req.query;
    
    const query: any = {};
    
    if (isOnline !== undefined) {
      query.isOnline = isOnline === 'true';
    }
    
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const drivers = await Driver.find(query)
      .populate('userId', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Driver.countDocuments(query);

    res.json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: {
        drivers,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: drivers.length,
          totalCount: total,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve drivers',
    } as ApiResponse);
  }
});

// Verify driver (Admin only)
router.put('/:id/verify', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const driverId = req.params.id;
    
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { isVerified: true },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Driver verified successfully',
      data: { driver },
    } as ApiResponse);
  } catch (error) {
    console.error('Verify driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify driver',
    } as ApiResponse);
  }
});

export default router;