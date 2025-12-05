import express from 'express';
import userModel from '../models/userModel.js';
import rideModel from '../models/rideModel.js';
import authMiddleware, { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require ADMIN role
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all rides
router.get('/rides', async (req, res) => {
  try {
    const rides = await rideModel.getAll();
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const validRoles = ['CUSTOMER', 'DRIVER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        validRoles
      });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await userModel.updateRole(req.params.id, role);

    res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await userModel.delete(req.params.id);

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUserId: req.params.id
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get system stats (bonus feature)
router.get('/stats', async (req, res) => {
  try {
    const usersResult = await userModel.getAll();
    const ridesResult = await rideModel.getAll();

    const stats = {
      totalUsers: usersResult.length,
      usersByRole: {
        customers: usersResult.filter(u => u.role === 'CUSTOMER').length,
        drivers: usersResult.filter(u => u.role === 'DRIVER').length,
        admins: usersResult.filter(u => u.role === 'ADMIN').length,
      },
      totalRides: ridesResult.length,
      ridesByStatus: {
        requested: ridesResult.filter(r => r.status === 'REQUESTED').length,
        accepted: ridesResult.filter(r => r.status === 'ACCEPTED').length,
        ongoing: ridesResult.filter(r => r.status === 'ONGOING').length,
        completed: ridesResult.filter(r => r.status === 'COMPLETED').length,
        cancelled: ridesResult.filter(r => r.status === 'CANCELLED').length,
      }
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
