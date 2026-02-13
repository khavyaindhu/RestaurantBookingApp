// helpers.ts – shared utility functions

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const generateConfirmationCode = (): string => {
  return 'RES' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone.replace(/\s+/g, ''));
};

export const getSeatStatusColor = (available: number, total: number): string => {
  const percentage = (available / total) * 100;
  if (percentage <= 20) return '#FF4444';
  if (percentage <= 50) return '#FFA500';
  return '#4CAF50';
};

export const getSeatStatusMessage = (available: number): string => {
  if (available === 0) return 'Fully Booked';
  if (available <= 10) return '🔥 Almost Full!';
  if (available <= 30) return '⚡ Filling Fast';
  return '✅ Good Availability';
};
