import { Button, StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Challenge } from './TabNavigator/Challenge.screen';
import { Feed } from './TabNavigator/Feed.screen';
import { Profile } from './TabNavigator/Profile.screen';
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';

const Tab = createBottomTabNavigator();

export const Home = () => {

   const dispatch = useDispatch();
   const navigation = useNavigation();
   const user = useSelector((state) => state.user);

   return (
      <Tab.Navigator initialRouteName="Feed" screenOptions={{
         tabBarActiveTintColor: 'green',
         tabBarInactiveTintColor: 'gray',
         headerStyle: {
            backgroundColor: user.darkMode ? 'black' : 'white',
         },
         headerTitleStyle: {
            color: user.darkMode ? 'white' : 'black',
         },
         headerTintColor: user.darkMode ? 'white' : 'black',
         tabBarStyle: {
            backgroundColor: user.darkMode ? 'black' : 'white',
         },
      }}>
         <Tab.Screen name="Feed" component={Feed} options={{ tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="rocket" color={color} size={size} />), headerShown: false }} />
         <Tab.Screen name="Challenge" component={Challenge} options={{ tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="fire" color={color} size={size} />) }} />
         <Tab.Screen name="Profile" component={Profile} color={user.darkMode ? 'white' : 'black'} options={{
            headerTitle: () => (<Text style={{ color: user.darkMode ? 'white' : 'black', fontSize: 20 }}>Profile</Text>
            ),
            tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons
               name="account" color={color} size={size} />), headerRight: () => (
                  <Button
                     onPress={() => {
                        dispatch({ type: 'LOGOUT' })
                        navigation.navigate('Start')
                     }
                     }
                     title="Logout"
                     color={user.darkMode ? 'white' : 'black'}
                  />
               ), headerLeft: () => (
                  <Button
                     onPress={() => dispatch(loginSuccess(
                        { ...user, darkMode: !user.darkMode }))}
                     title={user.darkMode ? '☀' : '🌙'}
                  />
               ),
            headerBackground: () => (
               <View style={{ backgroundColor: user.darkMode ? 'black' : 'white', flex: 1 }} />
            )
         }} />
      </Tab.Navigator>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
   },
})