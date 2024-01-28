import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
   name: 'user',
   initialState: {
      // Initialize with only the necessary serializable properties
      uid: null,
      email: null,
      displayName: null,
      darkMode: false,
      // Add other user-related properties here
   },
   reducers: {
      loginSuccess: (state, action) => {
         // Extract and store only the necessary serializable user data
         const { uid, email, displayName, darkMode } = action.payload;
         return {
            uid,
            email,
            displayName,
            darkMode,
            // Add other serializable user data here
         };
      },
      logout: () => ({
         // Clear user data when logging out by returning an empty object
      }),
   },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
