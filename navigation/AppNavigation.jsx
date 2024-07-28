import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthProvider } from '../context/AuthContext';
import BusContext from '../context/BusContext';
import QRCodeScanner from '../screens/QRCode';
import Scanner from '../screens/Scanner';

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
    return (
        <NavigationContainer>
            <AuthProvider>
                <BusContext>
                    <Stack.Navigator initialRouteName='Login' screenOptions={{
                        headerShown: false
                    }}>
                        <Stack.Screen name='Home' component={HomeScreen} />
                        <Stack.Screen name='Login' component={LoginScreen} />
                        <Stack.Screen name='Scan' component={QRCodeScanner} />
                        <Stack.Screen name='Scanner' component={Scanner} />
                    </Stack.Navigator>
                </BusContext>
            </AuthProvider>
        </NavigationContainer>
    )
}

export default AppNavigation
