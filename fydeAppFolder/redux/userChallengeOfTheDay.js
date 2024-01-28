import { createSlice } from '@reduxjs/toolkit';

const userChallengeOfTheDay = createSlice({
   name: 'userChallengeOfTheDay',
   initialState: {
      // Initialize with only the necessary serializable properties
   },
   reducers: {
      userChallengeSuccess: (state, action) => {
         // Extract and store only the necessary serializable user data
         const { day, challenge } = action.payload;
         return {
            day,
            challenge,
         };
      },
   },
});

export const { userChallengeSuccess } = userChallengeOfTheDay.actions;

export default userChallengeOfTheDay.reducer;
