import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Driver } from '../models/Driver';
import { ApiResponse, LoginRequest, RegisterRequest } from '../types';
import { validateRegister, validateLogin } from '../utils/validation';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      } as ApiResponse);
    }

    const { name, email, phone, password, role } = req.body as RegisterRequest;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or phone already exists',
      } as ApiResponse);
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      role,
    });

    await user.save();

    // If role is driver, create driver profile
    if (role === 'driver') {
      const driver = new Driver({
        userId: user._id,
        licenseNumber: '', // Will be updated later
        vehicleInfo: {
          make: '',
          model: '',
          year: new Date().getFullYear(),
          color: '',
          licensePlate: '',
          vehicleType: 'sedan',
        },
        documents: {
          driverLicense: '',
          vehicleRegistration: '',
          insurance: '',
        },
      });

      await driver.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    } as ApiResponse);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      } as ApiResponse);
    }

    const { email, password } = req.body as LoginRequest;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      } as ApiResponse);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      } as ApiResponse);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    } as ApiResponse);
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      } as ApiResponse);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.',
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: { user: user.toJSON() },
    } as ApiResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    } as ApiResponse);
  }
});

export default router;