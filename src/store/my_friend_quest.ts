import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';
import { KEYSTRING } from '../utils/global';

interface init{
  friendId: number,
  name: string,
  updateAt: string,
  unread: number
}

// 初始化用户信息
const initialState : {
  myFriendQuestList: {
    is: boolean
    list: {
      [key:string]: {}
    }
  },// 我发送的好友请求列表
  getFriendQuestList: {
    is: boolean
    list: {
      [key:string]: {}
    }
    unread: number
  },// 我收到的好友请求列表
  statue: string,
} = {
  myFriendQuestList: {
    is: false,
    list: {}
  },// 我发送的好友请求列表
  getFriendQuestList: {
    is: false,
    list: {},
    unread: 0
  },// 我收到的好友请求列表
  statue: '',
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
    // 添加我发送的好友请求
    addMyFriendQuest:(state,action) => {
      state.myFriendQuestList.list[action.payload.friendId] = action.payload;
    },
    // 添加我收到的好友请求
    addGetFriendQuest:(state,action) => {
      state.getFriendQuestList.unread += 1
      state.getFriendQuestList.list[action.payload.id+KEYSTRING] = action.payload.data
    },
    // 清除自身收到的好友请求列表数据
    clearGetFriendQuest:(state,action) => {
      state.getFriendQuestList.unread--;
      delete state.getFriendQuestList.list[action.payload.friendId+KEYSTRING];
    },
    // 清除自身发送的好友请求列表数据
    clearMyFriendQuest:(state,action) => {
      delete state.myFriendQuestList.list[action.payload.from+KEYSTRING];
    }
  },
  // 异步请求我发送的好友请求列表
  extraReducers(builder){
    builder
    .addCase(myFriendQuest.fulfilled, (state, action) => {
      const result = action.payload.data.data.reduce((pre:{[key:string]:init},item:init)=>{
        pre[item.friendId+KEYSTRING] = item;
        return pre;
      },{})
      state.myFriendQuestList.is = true;
      state.myFriendQuestList.list = result;
      state.statue = 'succeeded'
    })

    // 异步请求我收到的好友请求列表
    builder
    .addCase(getFriendQuest.fulfilled, (state, action) => {
      let num = 0;
      const result = action.payload.data.data.reduce((pre:{[key:string]:init},item:init)=>{
        pre[item.friendId+KEYSTRING] = item;
        num += item.unread;
        return pre;
      },{})
      state.getFriendQuestList.unread = num;
      state.getFriendQuestList.is = true;
      state.getFriendQuestList.list = result;
      state.statue = 'succeeded'
    })
  }

})

export const {addMyFriendQuest,addGetFriendQuest,clearGetFriendQuest,clearMyFriendQuest} = myFriendQuestSlice.actions;
export const myFriendQuestResult = (state:{myQuest:{myFriendQuestList:{is:boolean,list:{[key:string]:init}}}}) => state.myQuest.myFriendQuestList;
export const getFriendQuestResult = (state:{myQuest:{getFriendQuestList:{is:boolean,list:{[key:string]:init},unread: number}}}) => state.myQuest.getFriendQuestList;
export default myFriendQuestSlice.reducer;