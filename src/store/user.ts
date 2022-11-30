import { createSlice } from '@reduxjs/toolkit'

interface init{
  id: number,
  name: string,
  tokens: string
}

// 初始化用户信息
const initialState = {
  userMsg: localStorage.getItem('users')===undefined?
  {}:JSON.parse(String(localStorage.getItem('users')))
}

//清空本地存储
localStorage.removeItem('users');

// store
const userSlice = createSlice({

  name: 'user',
  initialState,

  reducers: {
    // 储存用户信息
    setUser:(state,action) => {
      let {id,name,data:tokens} = action.payload;
      state.userMsg = {id,name,tokens};
      console.log('initialState.userMsg',initialState.userMsg);
    },
    // 获取state数据
    getUser:(state,action) => {
      console.log('state',state,action);
      return state;
    }
  }

})

// 返回用户信息
export const userResult = (state:{user:{userMsg:init}}) => state.user.userMsg;
// 返回设置用户信息的方法
export const {setUser} = userSlice.actions;
export default userSlice.reducer
export const userSlices = userSlice;