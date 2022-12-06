import { configureStore } from '@reduxjs/toolkit'//引入toolkit
import userReducer from './user'//引入的reducer函数，在下面会介绍到
import friendReducer from './friend';
export default configureStore({
  reducer: {
    user: userReducer,
    friend: friendReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})