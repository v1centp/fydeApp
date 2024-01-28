import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import { Image } from 'react-native'
import { useSelector } from 'react-redux'
import { db } from './../../firebase.config'
import { useState } from 'react';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { storage } from './../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const PostPicture = () => {
   const [buttonStatus, setButtonStatus] = useState(false);
   const photo = useSelector((state) => state.photoSaved);
   const user = useSelector((state) => state.user);
   const dayChallenge = useSelector((state) => state.challengeOfTheDay);

   const navigation = useNavigation();

   const challengeDoc = doc(db, 'challenges/October');
   const collectionCol = collection(db, 'collection');

   const sendDB = (url) => {
      try {
         console.log('entry')
         addDoc(collectionCol, {
            user: user.email,
            photo: url,
            date: dayChallenge.day,
            challenge: dayChallenge.challenge,
         })
         navigation.navigate('Home');
      } catch (error) {
         console.log(error);
      }
   }

   const uploadImage = async (uri) => {
      setButtonStatus(true);
      try {
         const response = await fetch(uri);
         const blob = await response.blob();
         const storageRef = ref(storage, `challenges/${user.email}/${dayChallenge.challenge}_${Date.now()}.jpg`);
         await uploadBytes(storageRef, blob);
         const url = await getDownloadURL(storageRef);
         return url
      } catch (error) {
         console.log(error);
      }
   }

   const colorStyle = {
      backgroundColor: user.darkMode ? 'white' : 'lightgrey',
      color: user.darkMode ? 'white' : 'white',
   }

   return (
      <SafeAreaView style={{ backgroundColor: user.darkMode ? 'black' : 'white', flex: 1 }}>
         <Text
            style={{
               fontSize: 30,
               fontWeight: 'bold',
               textAlign: 'center',
               marginTop: 20,
               padding: 20,
               color: user.darkMode ? 'white' : 'black'
            }}
         >Send challenge</Text>
         <Text style={{ textAlign: 'center', fontSize: 12, marginBottom: 5, color: user.darkMode ? 'white' : 'black' }}>{dayChallenge.day}</Text>
         <Text style={{ textAlign: 'center', fontSize: 20, color: user.darkMode ? 'white' : 'black' }}>{dayChallenge.challenge}</Text>
         <View style={[styles.card, colorStyle]}>
            <Image
               style={styles.photo}
               source={{ uri: photo.uri }}
            />
         </View>
         <Text style={{ textAlign: 'center', fontSize: 20, padding: 20, color: user.darkMode ? 'white' : 'black' }}>Validate challenge ?</Text>
         <TouchableOpacity style={{
            alignItems: "center",
            backgroundColor: user.darkMode ? 'white' : 'black',
            padding: 10,
            borderRadius: 10,
            margin: 10,
         }}
            onPress={() => uploadImage(photo.uri).then((url) => sendDB(url))}
            disabled={buttonStatus}>
            <Text style={{
               fontWeight: 'bold',
               fontSize: 20,
               color: user.darkMode ? 'black' : 'white'
            }}>Validate</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{
            alignItems: "center",
            backgroundColor: user.darkMode ? 'black' : 'white',
            padding: 10,
            borderRadius: 10,
            margin: 10,
            borderColor: user.darkMode ? 'white' : 'black',
            borderWidth: 1,
            border: 'solid'
         }}
            onPress={() => navigation.navigate('Home')}>
            <Text style={{
               fontWeight: 'bold',
               fontSize: 20, color: user.darkMode ? 'white' : 'black'
            }}>Cancel</Text>
         </TouchableOpacity>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
   },
   card: {
      borderRadius: 10,
      padding: 10,
      margin: 10,
   },
   photo: {
      resizeMode: "contain",
      margin: 20,
      height: 300,
   }
})
