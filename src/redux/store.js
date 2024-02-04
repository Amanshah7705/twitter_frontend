// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/useridslice';
import   FollowAndFollowingreducer   from '../redux/listSlice'
const store = configureStore({
  reducer: {
    user: userReducer,
    FollowAndFollowing:FollowAndFollowingreducer
  },
});

export default store;
