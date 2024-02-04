// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const FollowAndFollowingSlice = createSlice({
  name: 'FollowAndFollowing',
  initialState: {
    Follow:[],
    Following:[]
  },
  reducers: {
    setFollowid: (state, action) => {
      state.Follow = action.payload;
    },
    setFollowingid: (state, action) => {
        state.Following = action.payload
      }
    
  },
});

export const { setFollowid,setFollowingid } = FollowAndFollowingSlice.actions;

export const selectFollowlist = (state) => state.FollowAndFollowing.Follow;
export const SelectFollowingList = (state) => state.FollowAndFollowing.Following
export default FollowAndFollowingSlice.reducer;
