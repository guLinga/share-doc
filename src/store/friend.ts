import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../utils/axios';

interface init{
  friendId: number,
  name: string,
  updateAt: string
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

// store
const friendSlice = createSlice({

  name: 'friend',
  initialState,
    

  reducers: {
    setUser:(state,action) => {
      
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
  }

})

export const friendResult = (state:{friend:{friendList:{[key:number]:init}}}) => state.friend.friendList;
export default friendSlice.reducer