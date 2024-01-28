import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, Modal, Alert, ImageBackground } from 'react-native'
import { useSelector } from 'react-redux';
import { collection, doc, onSnapshot, orderBy, query, where, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './../../firebase.config';
import { useEffect, useState } from 'react';
import { EditMenu } from '../../components/EditMenu';
import { Likes } from '../../components/Likes';

export const Profile = () => {

   const [userChallenges, setUserChallenges] = useState("")
   const [modalVisible, setModalVisible] = useState(false);
   const [userData, setUserData] = useState("");
   const [showPhoto, setShowPhoto] = useState(false);
   const [photoSelected, setPhotoSelected] = useState(null);


   const user = useSelector((state) => state.user);

   const collectionCol = collection(db, 'collection');
   const userQuery = query(collectionCol,
      where('user', '==', user.email),
      // orderBy('date', 'desc')
   );

   const userDoc = doc(db, `users/${user.email}`);
   const userDataQuery = query(userDoc);

   useEffect(() => {
      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setUserChallenges(data.map((item) => {
            return {
               id: item.id,
               photo: item.photo,
               challenge: item.challenge,
               date: item.date,
               likes: item.likes,
            }
         }));
      })
      return unsubscribe;
   }, [])

   useEffect(() => {
      const unsubscribe = onSnapshot(userDataQuery, (snapshot) => {
         const data = snapshot.data();
         setUserData(data);
      })
      return unsubscribe;
   }, [])

   const selectPhoto = (item) => {
      console.log(item);
      setPhotoSelected(item);
      setShowPhoto(true);

   }

   const deleteChallenge = async (id) => {
      console.log('delete challenge', id);
      const docRef = doc(db, `collection/${id}`);
      deleteDoc(docRef);
   }

   const colorStyle = {
      backgroundColor: user.darkMode ? 'lightgrey' : 'white',
      color: user.darkMode ? 'white' : 'lightgrey',
   }

   return (
      <View style={{
         backgroundColor: user.darkMode ? 'black' : '#fff',
         flex: 1,
      }}>
         <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
               setModalVisible(!modalVisible);
            }}>
            <EditMenu setModalVisible={setModalVisible} modalVisible={modalVisible} userData={userData} />
         </Modal>
         <TouchableOpacity style={[styles.card, styles.profileCard, colorStyle]} onPress={() => setModalVisible(true)}>
            <Image
               style={styles.avatar}
               source={userData && userData.avatar && userData.avatar != '__' ? { uri: userData.avatar } : require('./../../assets/blankUser.png')}
            />
            <Text style={styles.name}>{userData && userData.username || user.email}</Text>
            <Text style={{
               position: 'absolute',
               right: 10,
               top: 10,
               fontSize: 20,
            }}>⚙️</Text>
         </TouchableOpacity>
         <View style={[styles.card, styles.profileCard]} onPress={() => setModalVisible(true)}>
            <Text style={{
               fontSize: 16,
               fontWeight: 'bold',
               marginBottom: 10,
            }}>{userData && userData.bio || "This is my bio"}</Text>
         </View>
         <Text style={styles.cardTittle}>Photos</Text>
         <FlatList
            data={userChallenges}
            numColumns={3}
            contentContainerStyle={{
               // alignItems: 'center',
            }}
            renderItem={({ item }) => (
               <>
                  <TouchableOpacity style={{
                  }}
                     onPress={() => selectPhoto(item)}
                     onLongPress={() => Alert.alert(
                        "Delete photo",
                        "Are you sure you want to delete this photo?",
                        [
                           {
                              text: "Cancel",
                              onPress: () => { },
                              style: "cancel"
                           },
                           { text: "OK", onPress: () => deleteChallenge(item.id) }
                        ]
                     )}
                  >
                     <View style={{
                        margin: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: 150,
                        maxHeight: 150,
                        minHeight: 150,
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: user.darkMode ? 'lightgrey' : 'white',
                        shadowRadius: 3,
                        elevation: 10,

                     }}>
                        <Image
                           style={{ width: 100, height: 100, borderRadius: 10, alignSelf: 'center' }}
                           source={{ uri: item.photo }}
                        />
                        <Text style={{
                           fontSize: 12,
                           textAlign: 'center',
                           fontWeight: 'bold',
                           maxWidth: 100,
                        }}>{item.challenge}</Text>
                        <Text style={{
                           fontSize: 12,
                           textAlign: 'center',
                        }}>{item.date}</Text>
                     </View>
                  </TouchableOpacity>
                  <Modal visible={showPhoto} transparent={true}
                     animationType="fade"
                     onRequestClose={() => setShowPhoto(!showPhoto)}>
                     <TouchableOpacity
                        style={{
                           flex: 1,
                           justifyContent: 'center',
                           alignItems: 'center',
                           backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                        onPressOut={() => setShowPhoto(false)}

                     >
                        <ImageBackground
                           style={{
                              width: "100%",
                              height: "100%",
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                           }}
                           source={{ uri: photoSelected?.photo }}
                        >
                           <View style={{
                              width: '100%',
                              height: 120,
                              marginRight: 20,
                              alignItems: 'flex-end',
                           }}>
                              <Likes item={photoSelected} />
                           </View>
                        </ImageBackground>
                     </TouchableOpacity>
                  </Modal>
               </>

            )
            }
            keyExtractor={(item, index) => index.toString()}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 10,
      padding: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      alignContent: 'center',
      justifyContent: 'center',
   },
   profileCard: {
      alignItems: 'center',
      marginTop: 20,
   },
   cardTittle: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#555',
      alignSelf: 'center',
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
   },
})