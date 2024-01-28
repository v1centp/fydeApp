import { createSlice } from '@reduxjs/toolkit';

const userPhoto = createSlice({
   name: 'photo',
   initialState: {
      exif: null,
      height: null,
      width: null,
      uri: null,
      // Initialize with only the necessary serializable properties
   },
   reducers: {
      photoSuccess: (state, action) => {
         // Extract and store only the necessary serializable user data
         const { exif, height, width, uri, base64 } = action.payload;
         return {
            exif,
            height,
            width,
            uri,
            base64,
         };
      },
   },
});

export const { photoSuccess } = userPhoto.actions;

export default userPhoto.reducer;
