import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';
import { getNowTime } from '../utils/time';

export const KEY = "XJE";

interface init{
  friendId: number,
  name: string,
  updateAt: string,
  is?: boolean,
  chat?: chat[],
  unread: number
}

interface chat{
  friendId:number,
  userId: number,
  message: string,
  updateAt: string,
  id: number
}

// 初始化用户信息
const initialState:{
  friendList: {
    [key:string]: init
  }
  statue: 'loading' | 'succeeded' | 'failed' | '',
  unread: number
} = {
  friendList: {},
  statue: '',
  unread: 0
}

// 异步请求用户列表
export const friendList = createAsyncThunk('friend/friendList',async () => {
  const result = await axios({
    url: '/friend/friendList'
  })
  return result;
})

// 异步请求聊天记录
export const chatList = createAsyncThunk('friend/chatList', async (friendId:number) => {
  const result = await axios({
    url: '/friend/messageList',
    params: {
      friendId
    }
  })
  return {
    friendId:friendId,
    result
  };
})

// store
const friendSlice = createSlice({

  name: 'friend',
  initialState,
    

  reducers: {

    // 添加消息
    addMessage:(state,action) => {
      state.friendList[action.payload.id+KEY].chat?.push(action.payload.data);
      const id = action.payload.id+KEY;
      const data = state.friendList[action.payload.id+KEY];
      delete state.friendList[action.payload.id+KEY];
      state.friendList = {
        [id]: data,
        ...state.friendList
      }
    },
    // 增加未读消息的数量
    addUnread:(state,action) => {
      state.unread++;
      state.friendList[action.payload.friendId+KEY].unread++;
    },
    // 清除未读消息的数量
    clearUnread:(state,action) => {
      state.unread -= state.friendList[action.payload.friendId+KEY].unread;
      state.friendList[action.payload.friendId+KEY].unread = 0;
    },
    // 增加好友
    addFriend:(state,action) => {
      const item = action.payload.msg
      state.friendList = {
        [item.from+KEY] : {
          friendId: item.from,
          name: item.data.name,
          updateAt: getNowTime(),
          is: true,
          chat: [],
          unread: 0
        },
        ...state.friendList
      }
    }
  },

  // 异步请求用户列表
  extraReducers(builder){
    builder
    .addCase(friendList.pending, (state, _) => {
      if(state.statue!=='succeeded')
      state.statue = 'loading'
    })
    .addCase(friendList.fulfilled, (state, action) => {
      let num = 0;
      if(state.statue!=='succeeded'){
        const result = action.payload.data.data.reduce((pre:{[key:string]:init},item:init)=>{
          item.is = false;
          item.chat = [];
          pre[item.friendId+KEY] = item;
          num+=item.unread;
          return pre;
        },{})
        state.friendList = result
        state.unread = num;
        state.statue = 'succeeded'
      }
    })
    .addCase(friendList.rejected, (state, _) => {
      if(state.statue!=='succeeded')
      state.statue = 'failed'
    })


    // 聊天异步遍历
    builder
    .addCase(chatList.fulfilled, (state, action) => {
      if(action.payload.result.data.code===200){
        state.friendList[action.payload.friendId+KEY].is = true;
        state.friendList[action.payload.friendId+KEY].chat = action.payload.result.data.data;
      }
      // state.friendList = result
      state.statue = 'succeeded'
    })
  }

})

export const unreadNum = (state:{friend:{unread:number}}) => state.friend.unread;
export const friendResult = (state:{friend:{friendList:{[key:string]:init}}}) => state.friend.friendList;
export const {addMessage,addUnread,clearUnread,addFriend} = friendSlice.actions;
export default friendSlice.reducer