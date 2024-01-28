// ResetScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from './../../firebase.config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

export const Reset = () => {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const navigation = useNavigation();

   const handleReset = async () => {
      sendPasswordResetEmail(auth, email)
         .then(() => {
            console.log('email sent')
            Alert.alert(
               "Email sent",
               "Please check your email")
            navigation.navigate('Start')
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage)
            console.log(errorCode, errorMessage)
         });
   };

   const navigateBack = () => {
      navigation.navigate('Start')
   }

   return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
         <View style={styles.card}>
            <Text style={styles.title}>Reset password</Text>
            <TextInput
               style={styles.input}
               placeholder="Email"
               onChangeText={(text) => setEmail(text)}
               value={email}
            />
         </View>
         <Text style={{
            color: 'red',
            textAlign: 'center',
            marginBottom: 10,
         }}>{error}</Text>

         <TouchableOpacity onPress={handleReset} style={styles.cardButton} >
            <Text style={{
               padding: 10,
               fontSize: 24,
               textAlign: 'center',
               color: '#000',
               fontWeight: 'bold',
            }}>Reset</Text>
         </TouchableOpacity>
         <TouchableOpacity title="Register" onPress={navigateBack} style={{
            marginTop: 15,
         }}
         >
            <Text style={{

               fontSize: 16,
               textAlign: 'center',
               color: 'white',
               fontWeight: 'bold',
            }}>Back</Text>
         </TouchableOpacity>
      </KeyboardAwareScrollView >

   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'black',
   },
   card: {
      justifyContent: 'center',
      padding: 50,
      backgroundColor: '#f4f4f4',
      opacity: 0.8,
      borderRadius: 10,
      margin: 5,
   },
   cardButton: {
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f4f4f4',
      opacity: 0.8,
      borderRadius: 10,
      margin: 5,
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

