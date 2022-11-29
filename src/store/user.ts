import { createSlice } from '@reduxjs/toolkit'

interface init{
  id: number,
  name: string
}

// 初始化用户信息
let initialState: init = 
(localStorage.getItem('user')==='undefined'||localStorage.getItem('cache')===undefined)?
{}:
JSON.parse(String(localStorage.getItem('user')));

//清空本地存储
localStorage.setItem('users', 'undefined')

// store
const postsSlice = createSlice({

  name: 'posts',
  initialState,

  reducers: {
    // 储存用户信息
    setUser:(state,action) => {
      let {id,name} = action.payload;
      state = {id,name};
    }
  }

})

// 刷新页面前将信息储存到本地
window.addEventListener('beforeunload', () => { 
  localStorage.setItem('user', JSON.stringify(initialState));
});

// 返回用户信息
export const userResult = (state:{user:init}) => state.user;

export default postsSlice.reducer