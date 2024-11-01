import { NavigationContainer } from '@react-navigation/native';
import FallDetectionScreen from '../components/HomePage/home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HistoryScreen from '../components/History/History';

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={FallDetectionScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;