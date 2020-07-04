import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Publish from '@Screens/Publish';
import InitialBottomTab from './InitialBottomTab';

const Stack = createStackNavigator();


const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Initial" component={InitialBottomTab} />
      <Stack.Screen name="Publish" component={Publish} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
