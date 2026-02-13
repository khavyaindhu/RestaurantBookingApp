import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        let iconName = 'home';
        if (route.name === 'Home') iconName = 'silverware-fork-knife';
        else if (route.name === 'Bookings') iconName = 'calendar-check';
        else if (route.name === 'Profile') iconName = 'account';
        return <Icon name={iconName} size={22} color={color} />;
      },
      tabBarActiveTintColor: Colors.bgDark,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        paddingBottom: 8,
        paddingTop: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Bookings" component={MyBookingsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;





// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import { useAuth } from '../context/AuthContext';

// // Auth Screens
// import SplashScreen from '../screens/SplashScreen';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';

// // Main Screens
// import HomeScreen from '../screens/HomeScreen';
// import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
// import BookingScreen from '../screens/BookingScreen';
// import PaymentScreen from '../screens/PaymentScreen';
// import ConfirmationScreen from '../screens/ConfirmationScreen';
// import MyBookingsScreen from '../screens/MyBookingsScreen';
// import ProfileScreen from '../screens/ProfileScreen';

// export type RootStackParamList = {
//   Splash: undefined;
//   Auth: undefined;
//   Main: undefined;
//   RestaurantDetail: { restaurantId: string };
//   Booking: undefined;
//   Payment: { bookingData: any };
//   Confirmation: { booking: any };
// };

// export type AuthStackParamList = {
//   Login: undefined;
//   Register: undefined;
// };

// export type MainTabParamList = {
//   Home: undefined;
//   MyBookings: undefined;
//   Profile: undefined;
// };

// const RootStack = createNativeStackNavigator<RootStackParamList>();
// const AuthStack = createNativeStackNavigator<AuthStackParamList>();
// const MainTab = createBottomTabNavigator<MainTabParamList>();

// const AuthNavigator = () => (
//   <AuthStack.Navigator screenOptions={{ headerShown: false }}>
//     <AuthStack.Screen name="Login" component={LoginScreen} />
//     <AuthStack.Screen name="Register" component={RegisterScreen} />
//   </AuthStack.Navigator>
// );

// const MainTabNavigator = () => (
//   <MainTab.Navigator
//     screenOptions={{
//       headerShown: false,
//       tabBarStyle: {
//         backgroundColor: '#1C1917',
//         borderTopColor: '#2C2926',
//         borderTopWidth: 1,
//         height: 64,
//         paddingBottom: 10,
//         paddingTop: 8,
//       },
//       tabBarActiveTintColor: '#C9A84C',
//       tabBarInactiveTintColor: '#78716C',
//       tabBarLabelStyle: {
//         fontSize: 10,
//         fontWeight: '700',
//         letterSpacing: 0.5,
//       },
//     }}
//   >
//     <MainTab.Screen
//       name="Home"
//       component={HomeScreen}
//       options={{
//         tabBarIcon: ({ color, size }) => (
//           <Icon name="silverware-fork-knife" color={color} size={size} />
//         ),
//         tabBarLabel: 'Restaurants',
//       }}
//     />
//     <MainTab.Screen
//       name="MyBookings"
//       component={MyBookingsScreen}
//       options={{
//         tabBarIcon: ({ color, size }) => (
//           <Icon name="calendar-check" color={color} size={size} />
//         ),
//         tabBarLabel: 'My Bookings',
//       }}
//     />
//     <MainTab.Screen
//       name="Profile"
//       component={ProfileScreen}
//       options={{
//         tabBarIcon: ({ color, size }) => (
//           <Icon name="account-circle" color={color} size={size} />
//         ),
//         tabBarLabel: 'Profile',
//       }}
//     />
//   </MainTab.Navigator>
// );

// const AppNavigator = () => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <RootStack.Navigator screenOptions={{ headerShown: false }}>
//         <RootStack.Screen name="Splash" component={SplashScreen} />
//       </RootStack.Navigator>
//     );
//   }

//   return (
//     <RootStack.Navigator screenOptions={{ headerShown: false }}>
//       {!user ? (
//         <RootStack.Screen name="Auth" component={AuthNavigator} />
//       ) : (
//         <>
//           <RootStack.Screen name="Main" component={MainTabNavigator} />
//           <RootStack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//           <RootStack.Screen name="Booking" component={BookingScreen} />
//           <RootStack.Screen name="Payment" component={PaymentScreen} />
//           <RootStack.Screen name="Confirmation" component={ConfirmationScreen} />
//         </>
//       )}
//     </RootStack.Navigator>
//   );
// };

// export default AppNavigator;
