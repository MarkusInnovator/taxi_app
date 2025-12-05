import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookRide from '../pages/BookRide';
import rideService from '../services/rideService';

// Mock rideService
vi.mock('../services/rideService', () => ({
  default: {
    createRide: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderBookRide = () => {
  return render(
    <BrowserRouter>
      <BookRide />
    </BrowserRouter>
  );
};

describe('BookRide Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders booking form', () => {
    renderBookRide();
    expect(screen.getByText(/book a ride/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pickup address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/drop-off address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheduled time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimated price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book ride/i })).toBeInTheDocument();
  });

  test('submits form when fields are filled', async () => {
    rideService.createRide.mockResolvedValue({ id: 1 });
    renderBookRide();
    
    const pickupInput = screen.getByLabelText(/pickup address/i);
    fireEvent.change(pickupInput, { target: { value: '123 Main St' } });
    
    const bookButton = screen.getByRole('button', { name: /book ride/i });
    expect(bookButton).toBeInTheDocument();
  });

  test('successful booking redirects to my rides', async () => {
    rideService.createRide.mockResolvedValue({
      id: 1,
      pickupAddress: '123 Main St',
      dropoffAddress: '456 Oak Ave',
      status: 'REQUESTED',
    });

    renderBookRide();
    
    const pickupInput = screen.getByLabelText(/pickup address/i);
    const dropoffInput = screen.getByLabelText(/dropoff address/i);
    const priceInput = screen.getByLabelText(/estimated price/i);
    const bookButton = screen.getByRole('button', { name: /book ride/i });

    fireEvent.change(pickupInput, { target: { value: '123 Main St' } });
    fireEvent.change(dropoffInput, { target: { value: '456 Oak Ave' } });
    fireEvent.change(priceInput, { target: { value: '25.00' } });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(rideService.createRide).toHaveBeenCalledWith({
        pickupAddress: '123 Main St',
        dropoffAddress: '456 Oak Ave',
        scheduledFor: expect.any(String),
        estimatedPrice: '25.00',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/my-rides');
    });
  });

  test('displays error message on failed booking', async () => {
    rideService.createRide.mockRejectedValue({
      response: { data: { error: 'Booking failed' } },
    });

    renderBookRide();
    
    const pickupInput = screen.getByLabelText(/pickup address/i);
    const dropoffInput = screen.getByLabelText(/drop-off address/i);
    const priceInput = screen.getByLabelText(/estimated price/i);
    const bookButton = screen.getByRole('button', { name: /book ride/i });

    fireEvent.change(pickupInput, { target: { value: '123 Main St' } });
    fireEvent.change(dropoffInput, { target: { value: '456 Oak Ave' } });
    fireEvent.change(priceInput, { target: { value: '25.00' } });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText('Booking failed')).toBeInTheDocument();
    });
  });
});
