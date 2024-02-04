// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userid: "",
  },
  reducers: {
    setuserid: (state, action) => {
      state.userid = action.payload;
    },
  },
});

export const { setuserid } = userSlice.actions;

export const selectuserid = (state) => state.user.userid;

export default userSlice.reducer;
