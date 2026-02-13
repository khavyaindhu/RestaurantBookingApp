import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (replace with real API)
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', password: 'password123', token: 'mock-token-1' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Replace this block with real API call:
      // const response = await ApiService.login(email, password);
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        return { success: false, message: 'Invalid email or password' };
      }
      const { password: _, ...userWithoutPassword } = foundUser;
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Replace with real API call:
      // const response = await ApiService.register(name, email, phone, password);
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }
      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        phone,
        token: 'mock-token-' + Date.now(),
      };
      MOCK_USERS.push({ ...newUser, password });
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
