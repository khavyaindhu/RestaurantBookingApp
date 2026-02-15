import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USERS: '@restaurant_app_users',
  CURRENT_USER: '@restaurant_app_current_user',
  BOOKINGS: '@restaurant_app_bookings',
};

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface StoredBooking {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  seats: number;
  totalAmount: number;
  confirmationCode: string;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'skipped';
}

class StorageService {
  // ─── User Management ────────────────────────────────────────────────────────

  async getAllUsers(): Promise<StoredUser[]> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async saveUser(user: StoredUser): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      users.push(user);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  async findUserByEmail(email: string): Promise<StoredUser | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async setCurrentUser(user: StoredUser): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error setting current user:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<StoredUser | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async clearCurrentUser(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Error clearing current user:', error);
      return false;
    }
  }

  // ─── Booking Management ─────────────────────────────────────────────────────

  async getAllBookings(): Promise<StoredBooking[]> {
    try {
      const bookingsJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return bookingsJson ? JSON.parse(bookingsJson) : [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  async saveBooking(booking: StoredBooking): Promise<boolean> {
    try {
      const bookings = await this.getAllBookings();
      bookings.push(booking);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  }

  async updateBooking(bookingId: string, updates: Partial<StoredBooking>): Promise<boolean> {
    try {
      const bookings = await this.getAllBookings();
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating booking:', error);
      return false;
    }
  }

  async getUserBookings(userId: string): Promise<StoredBooking[]> {
    try {
      const bookings = await this.getAllBookings();
      return bookings.filter(b => b.userId === userId);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    return this.updateBooking(bookingId, { bookingStatus: 'cancelled' });
  }

  // ─── Clear All Data ─────────────────────────────────────────────────────────

  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.CURRENT_USER,
        STORAGE_KEYS.BOOKINGS,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
}

export default new StorageService();