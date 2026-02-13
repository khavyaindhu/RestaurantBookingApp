/**
 * ApiService.ts
 *
 * This file is the central place to connect the app to a real REST API backend.
 * Replace BASE_URL with your actual server URL and uncomment/implement the
 * methods below when you have a backend ready.
 *
 * The AuthContext and BookingContext currently use mock data.
 * To switch to real API:
 *   1. Set BASE_URL below
 *   2. Implement each method using axios
 *   3. Replace the mock logic in AuthContext and BookingContext with calls to this service
 */

import axios from 'axios';

// ─── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = 'https://your-api-server.com/api'; // ← Replace with real URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ─── Auth Endpoints ─────────────────────────────────────────────────────────────
export const ApiService = {
  // POST /auth/login
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // Expected: { user, token }
  },

  // POST /auth/register
  register: async (name: string, email: string, phone: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    return res.data;
  },

  // GET /restaurants
  getRestaurants: async () => {
    const res = await api.get('/restaurants');
    return res.data;
  },

  // GET /restaurants/:id/slots?date=YYYY-MM-DD
  getAvailableSlots: async (restaurantId: string, date: string) => {
    const res = await api.get(`/restaurants/${restaurantId}/slots`, { params: { date } });
    return res.data; // Expected: TimeSlot[]
  },

  // POST /bookings
  createBooking: async (payload: {
    restaurantId: string;
    userId: string;
    date: string;
    time: string;
    seats: number;
    paymentStatus: string;
    totalAmount: number;
  }) => {
    const res = await api.post('/bookings', payload);
    return res.data; // Expected: Booking object with confirmationCode
  },

  // GET /bookings?userId=xxx
  getUserBookings: async (userId: string) => {
    const res = await api.get('/bookings', { params: { userId } });
    return res.data;
  },

  // DELETE /bookings/:id
  cancelBooking: async (bookingId: string) => {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
  },

  // POST /payments/initiate — integrate Razorpay / Stripe / PayU here
  initiatePayment: async (amount: number, orderId: string) => {
    const res = await api.post('/payments/initiate', { amount, orderId });
    return res.data; // Returns payment gateway order details
  },

  // POST /payments/verify
  verifyPayment: async (paymentData: object) => {
    const res = await api.post('/payments/verify', paymentData);
    return res.data;
  },
};

export default ApiService;
