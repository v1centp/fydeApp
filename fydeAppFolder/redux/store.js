// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Define your user-related reducer
import userPhoto from './userPhoto'; // Define your user-related reducer
import userChallengeOfTheDay from './userChallengeOfTheDay'; // Define your user-related reducer

const store = configureStore({
   reducer: {
      user: userReducer,
      photoSaved: userPhoto,
      challengeOfTheDay: userChallengeOfTheDay,
      // Add other reducers as needed
   },
});

export default store;
