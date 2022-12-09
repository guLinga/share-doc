import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';

interface init{
  friendId: number,
  name: string,
  updateAt: string
}

// 初始化用户信息
const initialState = {
  friendList: [],
  statue: ''
}

// 异步请求用户列表
export const myFriendQuest = createAsyncThunk('myFriendQuest/myFriendQuest',async (friendId) => {
  const result = await axios({
    url: '/friend/myFriendQuest',
    params: {
      friendId
    }
  })
  return result;
})

// store
const myFriendQuestSlice = createSlice({

  name: 'myFriendQuest',
  initialState,
    

  reducers: {
    setUser:(state,action) => {
      
    },
  },
  // 异步请求
  extraReducers(builder){
    builder
    .addCase(myFriendQuest.pending, (state, _) => {
      state.statue = 'loading'
    })
    .addCase(myFriendQuest.fulfilled, (state, action) => {
      state.friendList = state.friendList.concat(action.payload.data.data);
      state.statue = 'succeeded'
    })
    .addCase(myFriendQuest.rejected, (state, _) => {
      state.statue = 'failed'
    })
  }

})

export const myFriendQuestResult = (state:{myQuest:{friendList:init[]}}) => state.myQuest.friendList;
export default myFriendQuestSlice.reducer