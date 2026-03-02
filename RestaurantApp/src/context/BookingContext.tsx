import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import StorageService from '../services/StorageService';

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
  pricePerSeat: number; // ✨ NEW: Price varies per restaurant
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
  getAvailableSlots: (restaurantId: string, date: Date) => Promise<TimeSlot[]>;
  confirmBooking: (userId: string, paymentStatus: 'pending' | 'paid' | 'skipped', amount: number) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  refreshBookings: () => Promise<void>;
}



// Mock restaurant data with VARYING PRICES
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Grand Spice',
    cuisine: 'Indian',
    rating: 4.8,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    address: 'Sector 15, Navi Mumbai',
    totalSeats: 80,
    availableSeats: 45,
    openTime: '11:00',
    closeTime: '23:00',
    description: 'Authentic Indian cuisine with a modern twist. Renowned for biryanis and curries.',
    phone: '+91 98765 43210',
    pricePerSeat: 299, // ₹299 per seat
  },
  {
    id: '2',
    name: 'Sakura Garden',
    cuisine: 'Japanese',
    rating: 4.6,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    address: 'Palm Beach Road, Navi Mumbai',
    totalSeats: 60,
    availableSeats: 20,
    openTime: '12:00',
    closeTime: '22:30',
    description: 'Premium Japanese dining featuring fresh sushi, sashimi, and tempura.',
    phone: '+91 97654 32109',
    pricePerSeat: 599, // ₹599 per seat (Premium Japanese)
  },
  {
    id: '3',
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.7,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    address: 'Panvel, Navi Mumbai',
    totalSeats: 70,
    availableSeats: 55,
    openTime: '11:30',
    closeTime: '23:30',
    description: 'Classic Italian pastas, wood-fired pizzas, and fine wines in an elegant setting.',
    phone: '+91 96543 21098',
    pricePerSeat: 399, // ₹399 per seat
  },
  {
    id: '4',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.5,
    priceRange: '₹₹',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    address: 'Kharghar, Navi Mumbai',
    totalSeats: 100,
    availableSeats: 75,
    openTime: '11:00',
    closeTime: '22:00',
    description: 'Authentic Chinese flavors with dim sum, Peking duck, and wok specialties.',
    phone: '+91 95432 10987',
    pricePerSeat: 249, // ₹249 per seat (More affordable)
  },
  {
    id: '5',
    name: 'The Rooftop Grill',
    cuisine: 'Continental',
    rating: 4.9,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400',
    address: 'Panvel, Navi Mumbai', 
    totalSeats: 50,
    availableSeats: 10,
    openTime: '18:00',
    closeTime: '23:00',
    description: 'Stunning rooftop dining with city views, premium steaks, and craft cocktails.',
    phone: '+91 94321 09876',
    pricePerSeat: 799, // ₹799 per seat (Premium rooftop)
  },
];

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(true);

  // Load all bookings from AsyncStorage on mount
  useEffect(() => {
    loadBookingsFromStorage();
  }, []);
  
  // Add inside BookingProvider
const getRestaurantAvailableSeats = async (restaurantId: string): Promise<number> => {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return 0;

  const allBookings = await StorageService.getAllBookings();
  const totalBooked = allBookings
    .filter(b => b.restaurantId === restaurantId && b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + b.seats, 0);

  return Math.max(0, restaurant.totalSeats - totalBooked);
};

  const loadBookingsFromStorage = async () => {
    try {
      console.log('📚 Loading bookings from AsyncStorage...');
      const storedBookings = await StorageService.getAllBookings();
      console.log('✅ Loaded bookings:', storedBookings);
      
      // Convert StorageService format to Booking format
      const formattedBookings: Booking[] = storedBookings.map(b => ({
        id: b.id,
        restaurantId: b.restaurantId,
        restaurantName: b.restaurantName,
        restaurantImage: restaurants.find(r => r.id === b.restaurantId)?.image || '',
        userId: b.userId,
        date: b.date,
        time: b.time,
        seats: b.seats,
        totalAmount: b.totalAmount,
        paymentStatus: b.paymentStatus === 'paid' ? 'paid' : 'skipped',
        bookingStatus: b.bookingStatus,
        confirmationCode: b.confirmationCode,
        createdAt: new Date().toISOString(),
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('❌ Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookings = async () => {
    console.log('🔄 Refreshing bookings...');
    await loadBookingsFromStorage();
  };

 const getAvailableSlots = async (restaurantId: string, date: Date): Promise<TimeSlot[]> => {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return [];

  const slots: TimeSlot[] = [];
  const [openHour] = restaurant.openTime.split(':').map(Number);
  const [closeHour] = restaurant.closeTime.split(':').map(Number);
  const dateStr = formatDateKey(date);

  // ✅ Read LIVE from storage so all users see updated seats
  const allBookings = await StorageService.getAllBookings();console.log('🔍 All bookings in storage:', JSON.stringify(allBookings));
console.log('🔍 Looking for - restaurantId:', restaurantId, '| date:', dateStr);

  for (let h = openHour; h < closeHour; h += 1) {
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    const bookedSeats = allBookings
      .filter(b =>
        b.restaurantId === restaurantId &&
        b.date === dateStr &&
        b.time === timeStr &&
        b.bookingStatus !== 'cancelled'
      )
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

  const confirmBooking = async (
    userId: string, 
    paymentStatus: 'pending' | 'paid' | 'skipped', 
    amount: number
  ): Promise<Booking | null> => {
    try {
      console.log('💾 Creating new booking...');
      
      if (!selectedRestaurant) {
        console.error('❌ No restaurant selected');
        return null;
      }

      const code = 'RES' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newBooking: Booking = {
        id: String(Date.now()),
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        restaurantImage: selectedRestaurant.image,
        userId,
        date: formatDateKey(selectedDate),
        time: selectedTime,
        seats: selectedSeats,
        totalAmount: amount,
        paymentStatus,
        bookingStatus: 'confirmed',
        confirmationCode: code,
        createdAt: new Date().toISOString(),
      };

      console.log('📝 New booking:', newBooking);

      // Save to AsyncStorage
      const success = await StorageService.saveBooking({
        id: newBooking.id,
        userId: newBooking.userId,
        restaurantId: newBooking.restaurantId,
        restaurantName: newBooking.restaurantName,
        date: newBooking.date,
        time: newBooking.time,
        seats: newBooking.seats,
        totalAmount: newBooking.totalAmount,
        confirmationCode: newBooking.confirmationCode,
        bookingStatus: newBooking.bookingStatus,
        paymentStatus: newBooking.paymentStatus,
      });

      if (success) {
        // Update local state
        setBookings(prev => [newBooking, ...prev]);
        console.log('✅ Booking saved successfully');
        return newBooking;
      } else {
        console.error('❌ Failed to save booking to storage');
        return null;
      }
    } catch (error) {
      console.error('❌ Error confirming booking:', error);
      return null;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
      console.log('🚫 Cancelling booking:', bookingId);

      // Update in AsyncStorage
      const success = await StorageService.cancelBooking(bookingId);

      if (success) {
        // Update local state
        setBookings(prev =>
          prev.map(b =>
            b.id === bookingId ? { ...b, bookingStatus: 'cancelled' as const } : b
          )
        );
        console.log('✅ Booking cancelled successfully');
      } else {
        throw new Error('Failed to cancel booking in storage');
      }
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      throw error;
    }
  };

  const getUserBookings = (userId: string): Booking[] => {
    console.log('👤 Getting bookings for user:', userId);
    const userBookings = bookings.filter(b => b.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    console.log('📋 User bookings:', userBookings);
    return userBookings;
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
      refreshBookings,
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