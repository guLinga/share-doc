import { createSlice } from '@reduxjs/toolkit'

interface init{
  id: number,
  name: string,
  tokens: string
}

// 初始化用户信息
let initialState: init = 
(localStorage.getItem('user')==='undefined'||localStorage.getItem('cache'))?
{
  id: null,
  name: null,
  tokens: null
}:
JSON.parse(String(localStorage.getItem('user')));

//清空本地存储
localStorage.setItem('users', 'undefined')

// store
const userSlice = createSlice({

  name: 'user',
  initialState,

  reducers: {
    // 储存用户信息
    setUser:(state,action) => {
      console.log(state);
      let {id,name,data:tokens} = action.payload;
      state.id = id;
      state.name = name;
      state.tokens = tokens;
    }
  }

})

// 刷新页面前将信息储存到本地
window.addEventListener('beforeunload', () => { 
  localStorage.setItem('user', JSON.stringify(initialState));
});

// 返回用户信息
export const userResult = (state:{user:init}) => state.user;
// 返回设置用户信息的方法
export const {setUser} = userSlice.actions;
export default userSlice.reducer