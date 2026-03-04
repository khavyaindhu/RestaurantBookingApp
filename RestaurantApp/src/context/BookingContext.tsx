import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import StorageService from '../services/StorageService';
import { Dimensions } from 'react-native';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  images: string[];
  address: string;
  totalSeats: number;
  openTime: string;
  closeTime: string;
  description: string;
  phone: string;
  pricePerSeat: number;
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
  getLiveAvailableSeats: (restaurantId: string) => Promise<number>;
}

// ─── 15 Mock Restaurants around Navi Mumbai ───────────────────────────────────

const MOCK_RESTAURANTS: Restaurant[] = [
  // ── Original 5 ──────────────────────────────────────────────────────────────
  {
    id: '1',
    name: 'The Grand Spice',
    cuisine: 'Indian',
    rating: 4.8,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=800',
      'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
    ],
    address: 'Sector 15, Navi Mumbai',
    totalSeats: 80,
    openTime: '11:00',
    closeTime: '23:00',
    description: 'Authentic Indian cuisine with a modern twist. Renowned for biryanis and curries. Experience fine dining with traditional recipes prepared by award-winning chefs.',
    phone: '+91 98765 43210',
    pricePerSeat: 299,
  },
  {
    id: '2',
    name: 'Sakura Garden',
    cuisine: 'Japanese',
    rating: 4.6,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=800',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800',
    ],
    address: 'Palm Beach Road, Navi Mumbai',
    totalSeats: 60,
    openTime: '12:00',
    closeTime: '22:30',
    description: 'Premium Japanese dining featuring fresh sushi, sashimi, and tempura. Omakase experience with imported ingredients from Japan. Serene ambiance with traditional decor.',
    phone: '+91 97654 32109',
    pricePerSeat: 599,
  },
  {
    id: '3',
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.7,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
    ],
    address: 'Panvel, Navi Mumbai',
    totalSeats: 70,
    openTime: '11:30',
    closeTime: '23:30',
    description: 'Classic Italian pastas, wood-fired pizzas, and fine wines in an elegant setting. Chef sources authentic ingredients directly from Italy. Romantic atmosphere perfect for special occasions.',
    phone: '+91 96543 21098',
    pricePerSeat: 399,
  },
  {
    id: '4',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.5,
    priceRange: '₹₹',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    images: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800',
    ],
    address: 'Kharghar, Navi Mumbai',
    totalSeats: 100,
    openTime: '11:00',
    closeTime: '22:00',
    description: 'Authentic Chinese flavors with dim sum, Peking duck, and wok specialties. Skilled wok masters bring traditional technique to every dish. Family-friendly atmosphere with spacious seating.',
    phone: '+91 95432 10987',
    pricePerSeat: 249,
  },
  {
    id: '5',
    name: 'The Rooftop Grill',
    cuisine: 'Continental',
    rating: 4.9,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400',
    images: [
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    ],
    address: 'Panvel, Navi Mumbai',
    totalSeats: 50,
    openTime: '18:00',
    closeTime: '23:00',
    description: 'Stunning rooftop dining with panoramic city views, premium steaks, and craft cocktails. Award-winning sommelier curates wine selection. Exclusive venue for celebrations and special dinners.',
    phone: '+91 94321 09876',
    pricePerSeat: 799,
  },

  // ── 10 New Restaurants ───────────────────────────────────────────────────────
  {
    id: '6',
    name: 'Spice Route',
    cuisine: 'Indian',
    rating: 4.4,
    priceRange: '₹₹',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    images: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800',
    ],
    address: 'Vashi, Navi Mumbai',
    totalSeats: 90,
    openTime: '10:00',
    closeTime: '23:00',
    description: 'A celebration of India\'s diverse culinary heritage — from Rajasthani dal baati to Kerala fish curry. Street-style starters and royal main courses in a vibrant, colourful setting.',
    phone: '+91 93210 98765',
    pricePerSeat: 199,
  },
  {
    id: '7',
    name: 'Seoul Kitchen',
    cuisine: 'Korean',
    rating: 4.5,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=400',
    images: [
      'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=800',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    ],
    address: 'Belapur, Navi Mumbai',
    totalSeats: 55,
    openTime: '12:00',
    closeTime: '22:30',
    description: 'Authentic Korean BBQ with tabletop grills, kimchi platters, and Korean fried chicken. Carefully sourced ingredients and traditional banchan sides make every meal a feast.',
    phone: '+91 92109 87654',
    pricePerSeat: 449,
  },
  {
    id: '8',
    name: 'Café de Paris',
    cuisine: 'Continental',
    rating: 4.3,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400',
    images: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800',
    ],
    address: 'Nerul, Navi Mumbai',
    totalSeats: 45,
    openTime: '08:00',
    closeTime: '22:00',
    description: 'A Parisian-style café offering freshly baked croissants, quiches, crêpes, and hearty French bistro mains. Perfect for leisurely breakfasts or candlelit dinners.',
    phone: '+91 91098 76543',
    pricePerSeat: 349,
  },
  {
    id: '9',
    name: 'Thai Orchid',
    cuisine: 'Thai',
    rating: 4.6,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400',
    images: [
      'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800',
      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    ],
    address: 'Airoli, Navi Mumbai',
    totalSeats: 65,
    openTime: '11:30',
    closeTime: '23:00',
    description: 'Fragrant Thai curries, pad thai, and fresh spring rolls crafted by a Bangkok-trained chef. Serene orchid-themed interiors transport you straight to Thailand.',
    phone: '+91 90987 65432',
    pricePerSeat: 379,
  },
  {
    id: '10',
    name: 'Tandoor Tales',
    cuisine: 'Indian',
    rating: 4.7,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    images: [
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
      'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    ],
    address: 'Kopar Khairane, Navi Mumbai',
    totalSeats: 75,
    openTime: '12:00',
    closeTime: '23:30',
    description: 'Specialising in clay-oven delicacies — succulent tandoori kebabs, naans, and slow-cooked curries. A North Indian feast experience with live music on weekends.',
    phone: '+91 89876 54321',
    pricePerSeat: 329,
  },
  {
    id: '11',
    name: 'The Mediterranean',
    cuisine: 'Continental',
    rating: 4.5,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800',
    ],
    address: 'Sanpada, Navi Mumbai',
    totalSeats: 55,
    openTime: '12:30',
    closeTime: '23:00',
    description: 'Sun-kissed flavours of Greece, Turkey, and Lebanon — mezze platters, grilled seafood, and wood-fired flatbreads. An elegant retreat with a warm, earthy ambiance.',
    phone: '+91 88765 43210',
    pricePerSeat: 549,
  },
  {
    id: '12',
    name: 'Wok & Roll',
    cuisine: 'Chinese',
    rating: 4.2,
    priceRange: '₹₹',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800',
    ],
    address: 'Ghansoli, Navi Mumbai',
    totalSeats: 85,
    openTime: '11:00',
    closeTime: '22:30',
    description: 'Quick, flavourful Chinese street food — dumplings, momos, crispy spring rolls, and steaming bowls of noodle soup. High energy, great food, great value.',
    phone: '+91 87654 32109',
    pricePerSeat: 179,
  },
  {
    id: '13',
    name: 'Olive Garden Bistro',
    cuisine: 'Italian',
    rating: 4.4,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400',
    images: [
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    ],
    address: 'Kamothe, Navi Mumbai',
    totalSeats: 60,
    openTime: '11:00',
    closeTime: '23:00',
    description: 'Rustic Italian trattoria with homemade pastas, thin-crust pizzas, and classic tiramisu. Outdoor seating under olive trees creates a charming, relaxed atmosphere.',
    phone: '+91 86543 21098',
    pricePerSeat: 319,
  },
  {
    id: '14',
    name: 'Saffron Lounge',
    cuisine: 'Indian',
    rating: 4.8,
    priceRange: '₹₹₹₹',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800',
      'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    ],
    address: 'CBD Belapur, Navi Mumbai',
    totalSeats: 50,
    openTime: '19:00',
    closeTime: '23:30',
    description: 'An upscale Indian fine-dining experience with molecular gastronomy twists on Mughal classics. Chef\'s tasting menus and curated mocktail pairings make this an unforgettable evening.',
    phone: '+91 85432 10987',
    pricePerSeat: 899,
  },
  {
    id: '15',
    name: 'Harbour View Seafood',
    cuisine: 'Seafood',
    rating: 4.6,
    priceRange: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    images: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    ],
    address: 'Uran Road, Navi Mumbai',
    totalSeats: 70,
    openTime: '12:00',
    closeTime: '22:30',
    description: 'Fresh-catch seafood with stunning harbour views — Konkani fish thali, butter garlic prawns, and crab masala. Ingredients sourced daily from local fishing docks.',
    phone: '+91 84321 09876',
    pricePerSeat: 479,
  },
];

export default MOCK_RESTAURANTS;

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

  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  const getLiveAvailableSeats = async (restaurantId: string): Promise<number> => {
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

    const allBookings = await StorageService.getAllBookings();
    console.log('🔍 All bookings in storage:', JSON.stringify(allBookings));
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

      const success = await StorageService.cancelBooking(bookingId);

      if (success) {
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
      getLiveAvailableSeats,
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