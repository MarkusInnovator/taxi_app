import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyRides from '../pages/MyRides';
import rideService from '../services/rideService';

// Mock rideService
vi.mock('../services/rideService', () => ({
  default: {
    getMyRides: vi.fn(),
    cancelRide: vi.fn(),
  },
}));

const mockRides = {
  rides: [
    {
      id: 1,
      pickupAddress: '123 Main St',
      dropoffAddress: '456 Oak Ave',
      status: 'REQUESTED',
      estimatedPrice: '25.00',
      scheduledFor: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      pickupAddress: '789 Pine St',
      dropoffAddress: '321 Elm St',
      status: 'COMPLETED',
      estimatedPrice: '30.00',
      finalPrice: '32.50',
      scheduledFor: '2024-01-14T14:00:00Z',
    },
  ],
};

const renderMyRides = () => {
  return render(
    <BrowserRouter>
      <MyRides />
    </BrowserRouter>
  );
};

describe('MyRides Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    rideService.getMyRides.mockImplementation(() => new Promise(() => {}));
    renderMyRides();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays rides after loading', async () => {
    rideService.getMyRides.mockResolvedValue(mockRides);

    renderMyRides();

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('789 Pine St')).toBeInTheDocument();
    });
  });

  test('displays status badges correctly', async () => {
    rideService.getMyRides.mockResolvedValue(mockRides);

    renderMyRides();

    await waitFor(() => {
      expect(screen.getByText('REQUESTED')).toBeInTheDocument();
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });
  });

  test('shows cancel button only for REQUESTED rides', async () => {
    rideService.getMyRides.mockResolvedValue(mockRides);

    renderMyRides();

    await waitFor(() => {
      const cancelButtons = screen.getAllByText('Cancel');
      expect(cancelButtons).toHaveLength(1); // Only one REQUESTED ride
    });
  });

  test('displays error message when fetching fails', async () => {
    rideService.getMyRides.mockRejectedValue({
      response: { data: { error: 'Failed to load rides' } },
    });

    renderMyRides();

    await waitFor(() => {
      expect(screen.getByText('Failed to load rides')).toBeInTheDocument();
    });
  });

  test('displays no rides message when list is empty', async () => {
    rideService.getMyRides.mockResolvedValue({ rides: [] });

    renderMyRides();

    await waitFor(() => {
      expect(screen.getByText(/no rides yet/i)).toBeInTheDocument();
    });
  });
});
