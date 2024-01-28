import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { db } from './../firebase.config';
import { storage } from './../firebase.config';
import firebase from 'firebase/app';
import { collection, doc, getDoc, setDoc, getDocs, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const EditMenu = ({ setModalVisible, modalVisible, userData }) => {

   const user = useSelector((state) => state.user);
   const [username, setUsername] = useState(userData && userData.username || null);
   const [bio, setBio] = useState(userData && userData.bio || 'This is my bio');
   const [avatarSource, setAvatarSource] = useState("");
   const [usernameAvailable, setUsernameAvailable] = useState(true);


   const userDoc = doc(db, `users/${user.email}`);
   const usersCol = collection(db, 'users');

   const handleUsernameChange = (newUsername) => {
      setUsername(newUsername.replace(/\s/g, '').toLowerCase());  // remove spaces and make lowercase
      if (newUsername) {
         if (newUsername.length < 4 || newUsername.length > 15) {
            setUsernameAvailable(false);
            return;
         }
         onSnapshot(usersCol, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            const userDB = data.find((item) => item.username === newUsername);
            const sameUsername = userData && userData.username === newUsername;

            if (!userDB || sameUsername) {
               // The username is already taken, and it matches the current user's username
               setUsernameAvailable(true);
            } else {
               // The username is either available or it's taken by another user
               setUsernameAvailable(false);
            }
         })
      }
   };

   const handleBioChange = (newBio) => {
      setBio(newBio);
   };

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
         });
         if (!result.canceled) {
            setAvatarSource(result.assets[0].uri);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const saveEdit = (url) => {
      if (!usernameAvailable) {
         return;
      }
      setDoc(userDoc, {
         username: username,
         bio: bio,
         avatar: url || userData && userData.avatar || "__",
      }, { merge: true });
      setModalVisible(!modalVisible)
   };

   const uploadImage = async (uri) => {
      if (!usernameAvailable) {
         Alert.alert("Username already taken or too short/long");
         return;
      }
      try {
         if (!uri) return;
         const response = await fetch(uri);
         const blob = await response.blob();
         const storageRef = ref(storage, `usersPic/${user.email}/${Date.now()}.jpg`);
         await uploadBytes(storageRef, blob);
         const url = await getDownloadURL(storageRef);
         return url
      } catch (error) {
      }
   }

   return (
      <SafeAreaView style={{ backgroundColor: user.darkMode ? 'black' : 'white', flex: 1 }}>
         <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#555',
            alignSelf: 'center',
            marginTop: 20,
         }}>Edit profile</Text>
         <TouchableOpacity style={[styles.card, styles.profileCard]} onPress={pickImage} >
            <Image
               style={styles.avatar}
               source={avatarSource ? { uri: avatarSource } : userData && userData.avatar && userData.avatar != '__' ? { uri: userData.avatar } : require('./../assets/blankUser.png')}
            />
         </TouchableOpacity>
         <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#555',
            alignSelf: 'center',
            marginTop: 20,
         }}>Username</Text>
         <View
            style={styles.input}

         >
            <TextInput
               style={{ flex: 1 }}
               value={username}
               onChangeText={(text) => handleUsernameChange(text)}
               placeholder={userData && userData.username ? `Enter your username (${userData.username})` : 'Enter your username'}
            />
            <Text>{usernameAvailable ? '✅' : '❌'}</Text>
         </View>
         <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#555',
            alignSelf: 'center',
            marginTop: 20,
         }}>Bio</Text>
         <TextInput
            style={styles.input}
            value={bio}
            onChangeText={handleBioChange}
         />
         <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#555',
            alignSelf: 'center',
            marginTop: 20,
         }}>Email</Text>
         <Text style={{
            borderRadius: 10,
            padding: 10,
            alignSelf: 'center',
            color: user.darkMode ? 'white' : 'black',
         }}>{user.email}</Text>
         <TouchableOpacity style={{
            alignItems: "center",
            backgroundColor: user.darkMode ? 'white' : 'black',
            padding: 10,
            borderRadius: 10,
            margin: 10,
         }} onPress={() => uploadImage(avatarSource).then((url) => { saveEdit(url) })}>
            <Text style={{
               fontSize: 20,
               fontWeight: 'bold',
               color: user.darkMode ? 'black' : 'white',
               alignSelf: 'center',
            }}>Save</Text>
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
         }} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{
               fontSize: 20,
               fontWeight: 'bold',
               color: user.darkMode ? 'white' : 'black',
               alignSelf: 'center',
            }}>Close</Text>
         </TouchableOpacity>

      </SafeAreaView >
   )
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
   },
   profileCard: {
      alignItems: 'center',
      marginTop: 20,
   },
   avatar: {
      width: 80,
      height: 80,
      borderRadius: 10,
   },
   name: {
      fontSize: 22,
      color: '#000',
      fontWeight: 'bold',
      marginBottom: 10,
   },
   input: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
})