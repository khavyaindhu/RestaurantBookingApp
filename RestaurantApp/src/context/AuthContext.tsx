import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
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
  logout: () => void;
}

// Mock users database (replace with real backend)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
  },
];

const MOCK_CREDENTIALS = {
  'john@example.com': 'password123',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const validPassword = MOCK_CREDENTIALS[email.toLowerCase() as keyof typeof MOCK_CREDENTIALS];
    if (!validPassword || validPassword !== password) {
      setIsLoading(false);
      return { success: false, message: 'Invalid email or password' };
    }

    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, message: 'User not found' };
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    if (MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      phone,
    };

    MOCK_USERS.push(newUser);
    (MOCK_CREDENTIALS as any)[email.toLowerCase()] = password;

    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};