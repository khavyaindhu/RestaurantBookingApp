import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService, { StoredUser } from '../services/StorageService';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        });
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Find user by email
      const storedUser = await StorageService.findUserByEmail(email);
      
      if (!storedUser) {
        return { success: false, message: 'User not found' };
      }

      // Check password
      if (storedUser.password !== password) {
        return { success: false, message: 'Incorrect password' };
      }

      // Set current user in storage
      await StorageService.setCurrentUser(storedUser);

      // Update state
      setUser({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      // Check if user already exists
      const existingUser = await StorageService.findUserByEmail(email);
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        phone,
        password,
      };

      // Save user to storage
      const saved = await StorageService.saveUser(newUser);
      if (!saved) {
        return { success: false, message: 'Failed to save user' };
      }

      // Set as current user
      await StorageService.setCurrentUser(newUser);

      // Update state
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    try {
      await StorageService.clearCurrentUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};