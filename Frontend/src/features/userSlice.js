import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  userAvatar: "",
  userProffesion: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload.userId;
    },
    setUserName: (state, action) => {
      state.userName = action.payload.userName;
    },
    setUserAvatar: (state, action) => {
      state.userAvatar = action.payload.userAvatar;
    },
    setUserProffesion: (state, action) => {
      state.userAbout = action.payload.userProffesion;
    },
    clearUser: (state) => {
      state.userId = "";
      state.userName = "";
      state.userAvatar = "";
      state.userProffesion = "";
    },
  },
});

export const {
  setUserId,
  setUserName,
  setUserAvatar,
  setUserProffesion,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;
