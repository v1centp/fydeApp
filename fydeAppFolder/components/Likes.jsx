import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal } from 'react-native'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection } from 'firebase/firestore';
import { db } from './../firebase.config';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { Image } from 'react-native';
import React from 'react';


export const Likes = ({ item }) => {
   const user = useSelector((state) => state.user);
   const [likes, setLikes] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
   const [userData, setUserData] = useState(null);

   const collectionDoc = doc(db, 'collection', item.id);
   const usersCol = collection(db, 'users');

   useEffect(() => {
      onSnapshot(collectionDoc, (doc) => {
         setLikes(doc.data()?.likes);
      })
   }, [])

   useEffect(() => {
      const unsubscribe = onSnapshot(usersCol, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setUserData(data);
      })
      return unsubscribe;
   }, [])

   const likeItem = (item) => () => {
      if (likes?.includes(user.email)) {
         updateDoc(collectionDoc, {
            likes: arrayRemove(user.email),
         })
      }
      else {
         updateDoc(collectionDoc, {
            likes: arrayUnion(user.email),
         })
      }
   }

   return (
      <>
         <TouchableOpacity onPress={likeItem(item)} style={{ marginBottom: 10 }} onLongPress={() => { setModalVisible(true) }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', borderRadius: 10, padding: 5 }}>
               <Text style={{ marginBottom: 5 }}>{likes?.includes(user.email) ? '❤️' : '🤍'}</Text>
               <Text style={styles.text}>{likes?.length}</Text>
            </View>
         </TouchableOpacity>
         <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
               Alert.alert("Modal has been closed.");
               setModalVisible(!modalVisible);
            }}
         >
            <View style={styles.centeredView}>
               <View style={styles.modalView}>
                  <Text style={styles.modalTextTitle}>Likes</Text>
                  {likes?.map((item, outerIndex) => {
                     return (
                        <React.Fragment key={outerIndex}>
                           {userData?.map((user, innerIndex) => {
                              if (user.id === item) {
                                 return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }} key={user.id}>
                                       <Image source={{ uri: user.avatar }} style={{ width: 20, height: 20, borderRadius: 50 }} />
                                       <Text style={styles.modalText}>{user.username}</Text>
                                    </View>
                                 );
                              }
                              return null; // Add this line to handle cases where there is no matching user.id
                           })}
                        </React.Fragment>
                     );
                  })}
                  <TouchableOpacity
                     style={{ ...styles.openButton, backgroundColor: "black", marginTop: 10, width: 100 }}
                     onPress={() => setModalVisible(!modalVisible)}
                  >
                     <Text style={styles.textStyle}>Hide</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
      </>
   )
}


const styles = StyleSheet.create({
   text: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'white',
      alignSelf: 'center',
   },
   centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
   },
   modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
   },
   openButton: {
      backgroundColor: "black",
      borderRadius: 20,
      padding: 10,
      elevation: 2
   },
   textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
   },
   modalTextTitle: {
      marginBottom: 15,
      fontWeight: 'bold',
   },
   modalText: {
      fontWeight: 'bold',
      marginLeft: 5,

   }
})