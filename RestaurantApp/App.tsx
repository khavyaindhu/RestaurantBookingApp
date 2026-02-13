import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { BookingProvider } from './src/context/BookingContext';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <BookingProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#1A0A2E" />
            <AppNavigator />
          </NavigationContainer>
        </BookingProvider>
      </AuthProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
