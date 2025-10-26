import { Router } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { ApiResponse } from '../types';

const router = Router();

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user: user.toJSON() },
    } as ApiResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
    } as ApiResponse);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, phone, profileImage, location } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(name && { name }),
        ...(phone && { phone }),
        ...(profileImage && { profileImage }),
        ...(location && { location }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser.toJSON() },
    } as ApiResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    } as ApiResponse);
  }
});

// Get all users (Admin only)
router.get('/', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: users.length,
          totalCount: total,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
    } as ApiResponse);
  }
});

// Deactivate user (Admin only)
router.put('/:id/deactivate', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: { user: user.toJSON() },
    } as ApiResponse);
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
    } as ApiResponse);
  }
});

export default router;