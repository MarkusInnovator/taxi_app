import { Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, authenticate } from '../middleware/auth';
import { Driver } from '../models/Driver';
import { User } from '../models/User';
import { ApiResponse, LoginRequest, RegisterRequest } from '../types';
import { validateLogin, validateRegister } from '../utils/validation';

const router = Router();

// Register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || 'Validation error',
      } as ApiResponse);
      return;
    }

    const { name, email, phone, password, role } = req.body as RegisterRequest;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email or phone already exists',
      } as ApiResponse);
      return;
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
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
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
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || 'Validation error',
      } as ApiResponse);
      return;
    }

    const { email, password } = req.body as LoginRequest;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      } as ApiResponse);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      } as ApiResponse);
      return;
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
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
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.',
      } as ApiResponse);
      return;
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

export default router; export default router;