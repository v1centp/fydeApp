import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { db } from './../../firebase.config'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, where, getDocs, getDoc } from 'firebase/firestore';

import { userChallengeSuccess } from '../../redux/userChallengeOfTheDay';

export const Challenge = () => {

   const user = useSelector((state) => state.user);

   const date = new Date();

   let day = date.getDate();
   let month = date.getMonth() + 1;
   let year = date.getFullYear();

   let currentDate = `${year}${month}${day}`;

   const navigation = useNavigation();
   const [challengeData, setChallengeData] = useState(null);
   const [collectionData, setCollectionData] = useState(null);
   const [userData, setUserData] = useState(null);

   const challengeCol = collection(db, 'challenges');
   const collectionCol = collection(db, 'collection');
   const usersCol = collection(db, 'users');

   const collectionQuery = query(collectionCol, where('user', '==', user.email));

   const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = onSnapshot(challengeCol, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         })
         );
         setChallengeData(data);
      })
      return unsubscribe;
   }, [])

   useEffect(() => {
      const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setCollectionData(data);
      })
      return unsubscribe;
   }, [])

   useEffect(() => {
      const unsubscribe = onSnapshot(usersCol, (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         const foundUser = data.find((item) => item.id === user.email);
         setUserData(foundUser);
      })
      return unsubscribe;
   }, [])

   const formatedDay = (day) => {
      return day.split('.').reverse().join('');
   }

   const goToChallenge = async (item) => {

      itemIdFormated = formatedDay(item.id);
      if (currentDate < itemIdFormated) {
         Alert.alert('Challenge locked');
         return
      } else {
         const foundCompletedChallenge = collectionData.find((userData) => item.challenge === userData.challenge);

         if (foundCompletedChallenge) {
            Alert.alert('You have already completed this challenge 🎉');
         } else {
            if (userData.username) {
               navigation.navigate('TakePicture')
               dispatch(userChallengeSuccess({
                  challenge: item.challenge,
                  day: item.id,
                  user: user.email,
               }))
            } else {
               Alert.alert('Please set up your profile first');
            }
         }
      }
   }

   const colorStyle = {
      backgroundColor: user.darkMode ? 'black' : 'white',
      color: user.darkMode ? 'white' : 'lightgrey',
   }

   return (
      <>
         <ScrollView style={colorStyle}>
            {challengeData && challengeData.map((item) => (
               <TouchableOpacity key={item.id} onPress={() => goToChallenge(item)}>
                  <View style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginBottom: 10,
                     backgroundColor: currentDate >= formatedDay(item.id) ? 'white' : 'lightgrey',
                     padding: 10,
                     borderRadius: 10,
                     marginBottom: 10,
                  }}>
                     <View style={{
                     }}>
                        <Text style={{
                           color: 'black',
                           fontSize: 12,
                        }}>{item.id}
                        </Text>
                        <Text style={{
                           color: 'black',
                           fontWeight: 'bold',
                           fontSize: 20,
                        }}>{currentDate >= formatedDay(item.id) ? item.challenge : 'Challenge locked'}
                        </Text>
                     </View>
                     <View>
                        <Text>
                           {currentDate >= formatedDay(item.id) ? collectionData && collectionData.find((userData) => item.challenge === userData.challenge) ? '✅' : 'not completed' : '🔒'}
                        </Text>

                     </View>
                  </View>
               </TouchableOpacity>
            ))}
         </ScrollView>
      </>
   )
}