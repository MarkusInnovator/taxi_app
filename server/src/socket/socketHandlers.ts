import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Driver } from '../models/Driver';
import { LocationUpdate } from '../types';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const initializeSocketHandlers = (io: Server): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        throw new Error('Authentication token required');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new Error('Invalid token or user not found');
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);

    // Join user to their room
    socket.join(`${socket.userRole}-${socket.userId}`);

    // Handle location updates (for drivers)
    socket.on('location-update', async (data: LocationUpdate) => {
      try {
        if (socket.userRole !== 'driver') {
          socket.emit('error', { message: 'Only drivers can update location' });
          return;
        }

        await Driver.findOneAndUpdate(
          { userId: socket.userId },
          {
            currentLocation: {
              latitude: data.latitude,
              longitude: data.longitude,
              heading: data.heading,
              speed: data.speed,
              lastUpdated: new Date(),
            },
          }
        );

        // Broadcast location to relevant customers (if driver is assigned to any active booking)
        socket.broadcast.emit('driver-location-update', {
          driverId: socket.userId,
          location: data,
        });
      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Handle driver going online/offline
    socket.on('driver-status-change', async (data: { isOnline: boolean }) => {
      try {
        if (socket.userRole !== 'driver') {
          socket.emit('error', { message: 'Only drivers can change status' });
          return;
        }

        await Driver.findOneAndUpdate(
          { userId: socket.userId },
          { isOnline: data.isOnline }
        );

        console.log(`🚗 Driver ${socket.userId} is now ${data.isOnline ? 'online' : 'offline'}`);
        
        socket.emit('status-updated', { isOnline: data.isOnline });
      } catch (error) {
        console.error('Driver status change error:', error);
        socket.emit('error', { message: 'Failed to update status' });
      }
    });

    // Handle booking status updates
    socket.on('booking-status-update', (data: { bookingId: string; status: string; location?: LocationUpdate }) => {
      // Broadcast to relevant parties
      socket.broadcast.emit('booking-status-changed', {
        bookingId: data.bookingId,
        status: data.status,
        location: data.location,
        timestamp: new Date(),
      });
    });

    // Handle chat messages (optional feature)
    socket.on('send-message', (data: { bookingId: string; message: string; recipientId: string }) => {
      socket.to(`user-${data.recipientId}`).emit('new-message', {
        bookingId: data.bookingId,
        message: data.message,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    });

    // Handle driver arrival notification
    socket.on('driver-arrived', (data: { bookingId: string; customerId: string }) => {
      socket.to(`customer-${data.customerId}`).emit('driver-arrived', {
        bookingId: data.bookingId,
        timestamp: new Date(),
      });
    });

    // Handle trip start/end
    socket.on('trip-started', (data: { bookingId: string; customerId: string }) => {
      socket.to(`customer-${data.customerId}`).emit('trip-started', {
        bookingId: data.bookingId,
        timestamp: new Date(),
      });
    });

    socket.on('trip-completed', (data: { bookingId: string; customerId: string; fare: number }) => {
      socket.to(`customer-${data.customerId}`).emit('trip-completed', {
        bookingId: data.bookingId,
        fare: data.fare,
        timestamp: new Date(),
      });
    });

    // Handle emergency situations
    socket.on('emergency-alert', (data: { bookingId: string; location: LocationUpdate; message: string }) => {
      // Broadcast to admin/support team
      socket.broadcast.to('admin-room').emit('emergency-alert', {
        userId: socket.userId,
        userRole: socket.userRole,
        bookingId: data.bookingId,
        location: data.location,
        message: data.message,
        timestamp: new Date(),
      });

      console.log(`🚨 Emergency alert from ${socket.userRole} ${socket.userId}`);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.userId} (${socket.userRole})`);

      // If driver disconnects, mark as offline
      if (socket.userRole === 'driver') {
        try {
          await Driver.findOneAndUpdate(
            { userId: socket.userId },
            { isOnline: false }
          );
        } catch (error) {
          console.error('Error updating driver offline status:', error);
        }
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Successfully connected to Taxi App',
      userId: socket.userId,
      role: socket.userRole,
    });
  });
};