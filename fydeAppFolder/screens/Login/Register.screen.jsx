// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './../../firebase.config'
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './../../redux/userSlice'




export const Register = () => {

   const navigation = useNavigation();

   const dispatch = useDispatch();


   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleRegister = async () => {
      createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            if (user) {
               navigation.navigate('Home')
               dispatch(loginSuccess(
                  {
                     email: user.email,
                     uid: user.uid,
                     displayName: user.displayName,
                     darkMode: false,
                  }
               ))
            }
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
         <ImageBackground style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
            <View style={styles.card}>
               <Text style={styles.title}>Register</Text>
               <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
               />
               <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(text) => setPassword(text)}
                  value={password}
               />
               <Text style={{
                  color: 'red',
                  textAlign: 'center',
                  marginBottom: 10,
               }}>{error}</Text>

            </View>
            <TouchableOpacity title="Register" onPress={handleRegister} style={styles.card} >
               <Text style={{
                  fontSize: 24,
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
               }}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Register" onPress={navigateBack} style={{
               marginTop: 15,
            }} >
               <Text style={{
                  fontSize: 14,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
               }}>Back</Text>
            </TouchableOpacity>
         </ImageBackground>
      </KeyboardAwareScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'black',
   },
   card: {
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f4f4f4',
      opacity: 0.8,
      borderRadius: 10,
      margin: 20,

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

