import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';

interface init{
  friendId: number,
  name: string,
  updateAt: string,
  is?: boolean,
  chat?: chat[]
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
    [key:number]: init
  }
  statue: 'loading' | 'succeeded' | 'failed' | ''
} = {
  friendList: {},
  statue: ''
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
      state.friendList[action.payload.id].chat?.push(action.payload.data);
    },
  },
  // 异步请求
  extraReducers(builder){
    builder
    .addCase(friendList.pending, (state, _) => {
      if(state.statue!=='succeeded')
      state.statue = 'loading'
    })
    .addCase(friendList.fulfilled, (state, action) => {
      if(state.statue!=='succeeded'){
        const result = action.payload.data.data.reduce((pre:{[key:string]:init},item:init)=>{
          item.is = false;
          item.chat = [];
          pre[item.friendId] = item;
          return pre;
        },{})
        state.friendList = result
        state.statue = 'succeeded'
      }
    })
    .addCase(friendList.rejected, (state, _) => {
      if(state.statue!=='succeeded')
      state.statue = 'failed'
    })

    builder
    .addCase(chatList.fulfilled, (state, action) => {
      if(action.payload.result.data.code===200){
        state.friendList[action.payload.friendId].is = true;
        state.friendList[action.payload.friendId].chat = action.payload.result.data.data;
      }
      // state.friendList = result
      state.statue = 'succeeded'
    })
  }

})

export const friendResult = (state:{friend:{friendList:{[key:number]:init}}}) => state.friend.friendList;
export const {addMessage} = friendSlice.actions;
export default friendSlice.reducer