// App.js
import React from 'react';
import { ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Register } from './screens/Login/Register.screen';
import { Home } from './screens/Home.screen';
import { Start } from './screens/Login/Start.screen';
import { Login } from './screens/Login/Login.screen';
import { Reset } from './screens/Login/Reset.screen';
import { TakePicture } from './screens/Challenge/TakePicture.screen';
import { PostPicture } from './screens/Challenge/PostPicture.screen';
import store from './redux/store';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();


const globalScreenOptions = {
  headerShown: false
}

export default function App() {
  return (

    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start"
          screenOptions={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Start" component={Start} options={globalScreenOptions} />
          <Stack.Screen name="Login" component={Login} options={globalScreenOptions} />
          <Stack.Screen name="Register" component={Register} options={globalScreenOptions} />
          <Stack.Screen name="Reset" component={Reset} options={globalScreenOptions} />
          <Stack.Screen name="Home" component={Home} options={globalScreenOptions} />
          <Stack.Screen name="TakePicture" component={TakePicture}
            options={{
              backgroundColor: 'black',
              headerShown: true,
              headerTransparent: true,
              headerTitle: '',
              headerBackTitleVisible: true,
              headerBackTitle: 'Back',
              headerTintColor: '#fff',
              headerStyle: {
                backgroundColor: 'black',

              },
            }}

          />
          <Stack.Screen name="PostPicture" component={PostPicture} options={globalScreenOptions}
          />
          {/* Add more screens here as needed */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider >
  );
}
