import React from 'react';
import Home from './screens/home';
import Maps from './Map';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Location_App = () => {
  const Stack = createStackNavigator();
  LogBox.ignoreLogs(['Warning: ...']); 
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Maps" component={Maps} /> 
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default Location_App;
