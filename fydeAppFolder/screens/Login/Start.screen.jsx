import { Pressable, StyleSheet, Text, View, Button, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card } from 'react-native-elements';
import { useEffect, useState } from 'react';

export const Start = () => {

   const navigation = useNavigation();
   const [displayLogin, setDisplayLogin] = useState(false)
   const handleLogin = () => {
      navigation.navigate('Login')
   }

   const handleRegister = () => {
      navigation.navigate('Register')
   }

   return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
         <ImageBackground style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            backgroundColor: 'black'

         }}>
            <Text
               style={{
                  fontSize: 56,
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                  textShadowOffset: { width: -1, height: 1 },
                  textShadowRadius: 10
               }}
            >
               FYDE
            </Text>
            <Image source={require('./../../assets/logo.png')} style={{
               width: "90%",
               height: 200,
               alignSelf: 'center',
               resizeMode: 'contain',
               borderRadius: 10
            }} />
            <Text
               style={{
                  fontSize: 24,
                  marginBottom: 20,
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                  textShadowOffset: { width: -1, height: 1 },
                  textShadowRadius: 10
               }}
            >The world is a playground but people tend to forget about it</Text>
            <TouchableOpacity title="Login" onPress={handleLogin} style={styles.card}>
               <Text style={{
                  fontSize: 24,
                  padding: 10,
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
               }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Register" onPress={handleRegister} style={styles.card} >
               <Text style={{
                  padding: 10,
                  fontSize: 24,
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
               }}>Register</Text>
            </TouchableOpacity>
         </ImageBackground>
      </KeyboardAwareScrollView >
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'black',
   },
   card: {
      justifyContent: 'center',
      backgroundColor: '#f4f4f4',
      padding: 10,
      borderRadius: 10,
      margin: 20,
      opacity: 0.8,
   },

   title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
   },
   input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
   },
});

