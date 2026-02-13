import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  address: string;
  totalSeats: number;
  availableSeats: number;
  openTime: string;
  closeTime: string;
  description: string;
  phone: string;
}

export interface TimeSlot {
  time: string;
  availableSeats: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  userId: string;
  date: string;
  time: string;
  seats: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'skipped';
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  confirmationCode: string;
  createdAt: string;
}

interface BookingContextType {
  restaurants: Restaurant[];
  bookings: Booking[];
  selectedRestaurant: Restaurant | null;
  selectedDate: Date;
  selectedTime: string;
  selectedSeats: number;
  setSelectedRestaurant: (r: Restaurant) => void;
  setSelectedDate: (d: Date) => void;
  setSelectedTime: (t: string) => void;
  setSelectedSeats: (n: number) => void;
  getAvailableSlots: (restaurantId: string, date: Date) => TimeSlot[];
  confirmBooking: (userId: string, paymentStatus: 'paid' | 'skipped', amount: number) => Booking;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: (userId: string) => Booking[];
}

// Mock restaurant data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Grand Spice',
    cuisine: 'Indian',
    rating: 4.8,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    address: '42 MG Road, Coimbatore',
    totalSeats: 80,
    availableSeats: 45,
    openTime: '11:00',
    closeTime: '23:00',
    description: 'Authentic Indian cuisine with a modern twist. Renowned for biryanis and curries.',
    phone: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'Sakura Garden',
    cuisine: 'Japanese',
    rating: 4.6,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    address: '8 Race Course Road, Coimbatore',
    totalSeats: 60,
    availableSeats: 20,
    openTime: '12:00',
    closeTime: '22:30',
    description: 'Premium Japanese dining featuring fresh sushi, sashimi, and tempura.',
    phone: '+91 97654 32109',
  },
  {
    id: '3',
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.7,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    address: '15 Avinashi Road, Coimbatore',
    totalSeats: 70,
    availableSeats: 55,
    openTime: '11:30',
    closeTime: '23:30',
    description: 'Classic Italian pastas, wood-fired pizzas, and fine wines in an elegant setting.',
    phone: '+91 96543 21098',
  },
  {
    id: '4',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.5,
    priceRange: '₹₹',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    address: '27 RS Puram, Coimbatore',
    totalSeats: 100,
    availableSeats: 75,
    openTime: '11:00',
    closeTime: '22:00',
    description: 'Authentic Chinese flavors with dim sum, Peking duck, and wok specialties.',
    phone: '+91 95432 10987',
  },
  {
    id: '5',
    name: 'The Rooftop Grill',
    cuisine: 'Continental',
    rating: 4.9,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400',
    address: '1 Town Hall Road, Coimbatore',
    totalSeats: 50,
    availableSeats: 10,
    openTime: '18:00',
    closeTime: '23:00',
    description: 'Stunning rooftop dining with city views, premium steaks, and craft cocktails.',
    phone: '+91 94321 09876',
  },
];

// Track bookings in memory (replace with AsyncStorage or API in production)
let ALL_BOOKINGS: Booking[] = [];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<number>(2);

  const getAvailableSlots = (restaurantId: string, date: Date): TimeSlot[] => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return [];

    const slots: TimeSlot[] = [];
    const [openHour] = restaurant.openTime.split(':').map(Number);
    const [closeHour] = restaurant.closeTime.split(':').map(Number);

    // Count bookings for each slot on the given date
    const dateStr = date.toDateString();

    for (let h = openHour; h < closeHour; h += 1) {
      const timeStr = `${h.toString().padStart(2, '0')}:00`;
      const bookedSeats = ALL_BOOKINGS
        .filter(b => b.restaurantId === restaurantId && b.date === dateStr && b.time === timeStr && b.bookingStatus !== 'cancelled')
        .reduce((sum, b) => sum + b.seats, 0);

      const available = restaurant.totalSeats - bookedSeats;
      slots.push({
        time: timeStr,
        availableSeats: Math.max(0, available),
        isAvailable: available > 0,
      });
    }
    return slots;
  };

  const confirmBooking = (userId: string, paymentStatus: 'paid' | 'skipped', amount: number): Booking => {
    const code = 'RES' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking: Booking = {
      id: String(Date.now()),
      restaurantId: selectedRestaurant!.id,
      restaurantName: selectedRestaurant!.name,
      restaurantImage: selectedRestaurant!.image,
      userId,
      date: selectedDate.toDateString(),
      time: selectedTime,
      seats: selectedSeats,
      totalAmount: amount,
      paymentStatus,
      bookingStatus: 'confirmed',
      confirmationCode: code,
      createdAt: new Date().toISOString(),
    };
    ALL_BOOKINGS.push(newBooking);
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    ALL_BOOKINGS = ALL_BOOKINGS.map(b => b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b));
  };

  const getUserBookings = (userId: string): Booking[] => {
    return ALL_BOOKINGS.filter(b => b.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <BookingContext.Provider value={{
      restaurants,
      bookings,
      selectedRestaurant,
      selectedDate,
      selectedTime,
      selectedSeats,
      setSelectedRestaurant,
      setSelectedDate,
      setSelectedTime,
      setSelectedSeats,
      getAvailableSlots,
      confirmBooking,
      cancelBooking,
      getUserBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
