# 🍽️ TableVault — Online Restaurant Seat Reservation System

A full-featured Android app built with **React Native + TypeScript** for booking restaurant tables with real-time seat availability tracking.

---

## 📱 Screens & Features

| Screen | Features |
|---|---|
| **Splash** | Animated logo on app launch |
| **Login / Register** | Secure auth with validation |
| **Home** | Restaurant list, search, cuisine filter |
| **Restaurant Detail** | Seat availability meter, live seat count |
| **Booking** | Date picker, time slot grid, seat count |
| **Payment** | UPI / Card / Net Banking (Optional) |
| **Confirmation** | Booking code, SMS/Email notice, share |
| **My Bookings** | Full history, cancel booking |
| **Profile** | Stats, account info, logout |

---

## 🗺️ Flow (matches provided flowchart)

```
START → App Open → Login/Register → Select Restaurant
     → Select Date & Time
     → Seats Available? ──YES──→ Confirm Booking → Payment (Optional)
                        ──NO──→ Change Date/Time
     → Booking Confirmation (SMS/Email)
     → Payment (Optional) → END
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- JDK 17
- Android Studio + Android SDK
- React Native CLI

### 1. Install dependencies
```bash
npm install
```

### 2. Link native modules
```bash
# For Android
cd android && ./gradlew clean && cd ..
npx react-native link react-native-vector-icons
```

### 3. Run on Android
```bash
npx react-native run-android
```

### 4. Start Metro bundler (if not auto-started)
```bash
npx react-native start
```

---

## 🏗️ Project Structure

```
RestaurantApp/
├── App.tsx                   # Root component
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx   # User auth state (login/register/logout)
│   │   └── BookingContext.tsx # Restaurants, bookings, seat tracking
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Stack + Tab navigation
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx         # Restaurant listing + search
│   │   ├── RestaurantDetailScreen.tsx # Seat availability display
│   │   ├── BookingScreen.tsx      # Date/time/seat selection
│   │   ├── PaymentScreen.tsx      # Payment gateway (optional)
│   │   ├── ConfirmationScreen.tsx # Success + confirmation code
│   │   ├── MyBookingsScreen.tsx   # Booking history + cancel
│   │   └── ProfileScreen.tsx     # User profile + stats
│   ├── services/
│   │   └── ApiService.ts     # REST API integration layer
│   └── utils/
│       └── helpers.ts        # Utility functions
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## 🔌 Connecting to a Real Backend

The app uses **mock data by default** and works offline.

To connect to a real server:
1. Open `src/services/ApiService.ts`
2. Set `BASE_URL` to your server URL
3. In `AuthContext.tsx`, replace the mock login/register logic with `ApiService.login()` / `ApiService.register()`
4. In `BookingContext.tsx`, replace mock data with `ApiService.getRestaurants()` and `ApiService.createBooking()`

### Recommended Backend Stack
- **Node.js + Express** or **Django REST Framework**
- **PostgreSQL** or **MySQL** for data
- **JWT** for authentication
- **Razorpay** for Indian payment processing

---

## 💳 Payment Integration (Razorpay)

The app includes `react-native-razorpay` in dependencies.

```typescript
// In PaymentScreen.tsx, replace simulatePayment() with:
import RazorpayCheckout from 'react-native-razorpay';

const handleRazorpayPayment = async () => {
  const orderData = await ApiService.initiatePayment(bookingData.totalAmount, orderId);
  const options = {
    description: `Table booking at ${bookingData.restaurantName}`,
    currency: 'INR',
    key: 'YOUR_RAZORPAY_KEY',
    amount: bookingData.totalAmount * 100, // paise
    name: 'TableVault',
    order_id: orderData.id,
    prefill: { name: user.name, email: user.email, contact: user.phone },
    theme: { color: '#FF6B35' },
  };
  const data = await RazorpayCheckout.open(options);
  await ApiService.verifyPayment(data);
  // Navigate to confirmation
};
```

---

## 🎨 Design System

| Color | Usage |
|---|---|
| `#1A0A2E` | Background (deep purple-black) |
| `#231040` | Card surfaces |
| `#FF6B35` | Primary accent (orange) |
| `#4CAF50` | Success / available seats |
| `#FFA500` | Warning / limited seats |
| `#FF4444` | Error / full / cancel |
| `#8B7BA8` | Secondary text |

---

## 🧪 Demo Credentials

- **Email:** `john@example.com`
- **Password:** `password123`

---

## 📝 License

MIT License — Free to use for academic and personal projects.

---

*Built for the Online Restaurant Seat Reservation System academic project.*
