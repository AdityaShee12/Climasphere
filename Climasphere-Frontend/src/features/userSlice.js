import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  fullName: "",
  avatar: "",
  proffesion: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload.userName;
    },
    setUserFullName: (state, action) => {
      state.fullName = action.payload.fullName;
    },
    setUserAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
    setUserProffesion: (state, action) => {
      state.proffesion = action.payload.proffesion;
    },
    clearUser: (state) => {
      state.userName = "";
      state.fullName = "";
      state.avatar = "";
      state.proffesion = "";
    },
  },
});

export const {
  setUserFullName,
  setUserName,
  setUserAvatar,
  setUserProffesion,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;
