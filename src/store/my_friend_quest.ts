import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';

interface init{
  friendId: number,
  name: string,
  updateAt: string
}

// 初始化用户信息
const initialState = {
  myFriendQuestList: {
    is: false,
    list: {}
  },// 我发送的好友请求列表
  getFriendQuestList: {
    is: false,
    list: {}
  },// 我收到的好友请求列表
  statue: ''
}

// 异步我发送的好友请求列表
export const myFriendQuest = createAsyncThunk('myFriendQuest/myFriendQuest',async () => {
  const result = await axios({
    url: '/friend/myFriendQuest'
  })
  return result;
})

// 遍历我收到的好友请求列表
export const getFriendQuest = createAsyncThunk('myFriendQuest/getFriendQuest',async () => {
  const result = await axios({
    url: '/friend/getFriendQuest'
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
    .addCase(myFriendQuest.fulfilled, (state, action) => {
      const result = action.payload.data.data.reduce((pre:{[key:number]:init},item:init)=>{
        pre[item.friendId] = item;
        return pre;
      },{})
      state.myFriendQuestList.is = true;
      state.myFriendQuestList.list = result;
      state.statue = 'succeeded'
    })

    builder
    .addCase(getFriendQuest.fulfilled, (state, action) => {
      const result = action.payload.data.data.reduce((pre:{[key:number]:init},item:init)=>{
        pre[item.friendId] = item;
        return pre;
      },{})
      state.getFriendQuestList.is = true;
      state.getFriendQuestList.list = result;
      state.statue = 'succeeded'
    })
  }

})

export const myFriendQuestResult = (state:{myQuest:{myFriendQuestList:{is:boolean,list:{[key:number]:init}}}}) => state.myQuest.myFriendQuestList;
export const getFriendQuestResult = (state:{myQuest:{getFriendQuestList:{is:boolean,list:{[key:number]:init}}}}) => state.myQuest.getFriendQuestList;
export default myFriendQuestSlice.reducer