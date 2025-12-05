import express from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import config from '../config/env.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'password']
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Validate role if provided
    const validRoles = ['CUSTOMER', 'DRIVER', 'ADMIN'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles
      });
    }

    // Create user
    const user = await userModel.create({ name, email, password, role, phone });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    // Find user
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await userModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Return token and user info (without password)
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (protected route example)
router.get('/me', async (req, res) => {
  try {
    // This would require authMiddleware
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret);
    
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

export default router;
