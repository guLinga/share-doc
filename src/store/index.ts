import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import friendReducer from './friend';
import myFriendQuestSlice from './my_friend_quest';

export default configureStore({
  reducer: {
    user: userReducer,
    friend: friendReducer,
    myQuest: myFriendQuestSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})