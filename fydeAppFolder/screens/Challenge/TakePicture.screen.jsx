import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useState } from 'react';
import { Alert, Button, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { photoSuccess } from './../../redux/userPhoto/';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const TakePicture = () => {
   const [type, setType] = useState(CameraType.back);
   const [permission, requestPermission] = Camera.useCameraPermissions();
   const [flashMode, setFlashMode] = useState(FlashMode.off);
   const [camera, setCamera] = useState(null);
   const [photo, setPhoto] = useState(null);

   const navigation = useNavigation();
   const dispatch = useDispatch();

   const user = useSelector((state) => state.user);

   if (!permission) {
      // Camera permissions are still loading
      return <View />;
   }

   if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
         <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
         </View>
      );
   }

   const toggleCameraType = () => {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
   }

   const toggleFlashMode = () => {
      setFlashMode(current => {
         switch (current) {
            case FlashMode.off:
               return FlashMode.on;
            case FlashMode.on:
               return FlashMode.auto;
            case FlashMode.auto:
               if (type === CameraType.front) {
                  return FlashMode.off;
               }
               return FlashMode.torch;
            case FlashMode.torch && CameraType.front:
               return FlashMode.off;
            default:
               return FlashMode.off;
         }
      });
   }

   const takePicture = async () => {
      if (camera) {
         try {
            const photo = await camera.takePictureAsync(
               {
                  quality: 0.3,
                  base64: false,
                  exif: true,
                  isImageMirror: true,
               }
            );
            if (photo.height < photo.width) {
               Alert.alert('Please lock your screen orientation to portrait');
               return;
            }
            if (type === "front") {
               const manipPhoto = await ImageManipulator.manipulateAsync(photo.uri, [
                  { flip: ImageManipulator.FlipType.Horizontal },
               ]);
               setPhoto(manipPhoto)
            } else {
               setPhoto(photo);
            }
         }
         catch (error) {
            console.error('Error taking photo:', error);
         }
      }
   };

   // save photo in the reducer and navigate to the next screen
   const savePhoto = (photo) => {
      dispatch(photoSuccess(
         {
            exif: photo.exif,
            height: photo.height,
            width: photo.width,
            uri: photo.uri,
            base64: photo.base64,
         })
      );
      return true;
   }

   return (
      <>
         {photo &&
            <>
               <SafeAreaView style={{ flex: 1, backgroundColor: user.darkMode ? 'black' : 'white' }}>
                  <ImageBackground source={{ uri: photo.uri }} style={{
                     flex: 1,
                     resizeMode: 'contain',
                     backgroundColor: 'black',
                  }} >
                     <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => setPhoto(null)} style={{
                           backgroundColor: 'black',
                           borderRadius: 50,
                           padding: 16,
                           margin: 16,

                        }}>
                           <MaterialCommunityIcons name="delete" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                           navigation.navigate('PostPicture', { photo: photo.uri });
                           savePhoto(photo) && setPhoto(null);
                        }} style={styles.buttonAccept}>
                           <MaterialCommunityIcons name="check" size={32} color="white" />
                        </TouchableOpacity>
                     </View>
                  </ImageBackground>
               </SafeAreaView>
            </>}
         {
            !photo &&
            <Camera style={styles.camera} type={type} flashMode={flashMode} ref={setCamera}>
               <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={toggleFlashMode}>
                     <MaterialCommunityIcons name={flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash' : flashMode === 'auto' ? 'flash-auto' : 'flashlight'} size={32} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={takePicture}>
                     <MaterialCommunityIcons name="camera-iris" size={32} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                     <MaterialCommunityIcons name={type === 'back' ? 'camera-front' : 'camera-rear'} size={32} color="white" />
                  </TouchableOpacity>
               </View>
            </Camera>
         }
      </>
   );
}

const styles = StyleSheet.create({
   camera: {
      flex: 1,
   },
   buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
   },
   button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
   },
   text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
   },
   buttonDelete: {
      backgroundColor: 'red',
      borderRadius: 50,
      padding: 16,
      margin: 16,
   },
   buttonAccept: {
      backgroundColor: 'green',
      borderRadius: 50,
      padding: 16,
      margin: 16,
   },
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});

