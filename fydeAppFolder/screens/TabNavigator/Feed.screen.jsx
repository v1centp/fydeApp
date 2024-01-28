import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, Alert, Modal } from 'react-native';
import { collection, doc, onSnapshot, orderBy, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from './../../firebase.config';
import { useEffect, useState } from 'react';
import { Likes } from '../../components/Likes';
import { useSelector } from 'react-redux';


export const Feed = () => {

   const challengeCol = collection(db, 'challenges');
   const collectionCol = collection(db, 'collection');

   const [challengeData, setChallengeData] = useState(null);
   const [collectionData, setCollectionData] = useState(null);

   const [modalVisible, setModalVisible] = useState(false);

   const [selectedItem, setSelectedItem] = useState(null);

   const user = useSelector((state) => state.user);

   useEffect(() => {
      const unsubscribe = onSnapshot(challengeCol, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         })
         );
         if (challengeData === null) {
            renderCollection(data[0]);
            setChallengeData(data);
         }
         else {
            setChallengeData(data);
         }
      });
      return unsubscribe;
   }, [])

   const renderCollection = async (item) => {
      setSelectedItem(item);
      const q = query(collectionCol, where('challenge', '==', item.challenge));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
      }));

      const dataWithUsername = await Promise.all(
         data.map(async (item) => {
            const userDoc = doc(db, 'users', item.user);
            const userSnap = await getDoc(userDoc);
            const userData = {
               username: userSnap.data().username,
               bio: userSnap.data().bio,
               avatar: userSnap.data().avatar,
               ...item,
            };
            return userData;
         })
      );

      setCollectionData(dataWithUsername);
   };

   return (
      <View style={{
         flex: 1,
         backgroundColor: user.darkMode ? '#000' : '#fff',
      }}>
         <SafeAreaView>
            <FlatList
               data={challengeData}
               horizontal={true}
               renderItem={({ item }) => {
                  return (
                     <TouchableOpacity style={{
                        backgroundColor: selectedItem?.id === item.id ? 'lightgrey' : '#fff',
                        borderRadius: 10,
                        padding: 10,
                        margin: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 0 },
                     }} onPress={() => { renderCollection(item) }}>
                        <Text style={{
                           fontWeight: selectedItem?.id === item.id ? 'bold' : 'normal',
                        }}>{item.challenge}</Text>
                        <Text>{item.id}</Text>
                     </TouchableOpacity>
                  )
               }}
            />
         </SafeAreaView>
         <ScrollView style={{
            backgroundColor: user.darkMode ? '#000' : '#fff',
         }}>
            {collectionData &&
               collectionData.map((item) => (
                  <View key={item.id} style={{
                     backgroundColor: user.darkMode ? '#000' : '#fff',
                     paddingTop: 10,
                  }}>
                     <Image source={{ uri: item.photo }} style={styles.userImage} />
                     <View style={styles.overlay}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 5 }}>
                           <Text style={styles.text}>{item.challenge}</Text>
                           <Text style={styles.text}>{item.date}</Text>
                        </View>
                        <View style={{
                           flexDirection: 'column',
                           alignItems: 'flex-end',
                        }}>
                           <Likes item={item} />
                           <TouchableOpacity onPress={() => { setModalVisible(true), setSelectedItem(item) }}>

                              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 5 }}>
                                 <Image source={{ uri: item.avatar }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }} />
                                 <Text style={styles.text}>{item.username}</Text>
                              </View>
                           </TouchableOpacity>
                        </View>
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
                                 <Image source={{ uri: selectedItem.avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                 <Text style={styles.modalText}>{selectedItem.username}</Text>
                                 <Text style={styles.modalText}>{selectedItem.bio}</Text>
                                 <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "black" }}
                                    onPress={() => setModalVisible(!modalVisible)}
                                 >
                                    <Text style={styles.textStyle}>Hide profile</Text>
                                 </TouchableOpacity>
                              </View>
                           </View>
                        </Modal>
                     </View>
                  </View>
               ))
            }
            {
               collectionData && collectionData.length === 0 && (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: user.darkMode ? '#000' : '#fff', }}>
                     <Text style={{
                        fontSize: 20, color: user.darkMode ? '#fff' : '#000',
                     }}>No posts yet</Text>
                  </View>
               )
            }
         </ScrollView >
      </View>
   )
}

const styles = StyleSheet.create({
   challenge: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
   },
   userImage: {
      width: '100%',
      height: 600,
   },
   overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 10,
   },
   text: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
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
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
   },
   textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
   },
   modalText: {
      marginBottom: 15,
      textAlign: "center"
   }
});