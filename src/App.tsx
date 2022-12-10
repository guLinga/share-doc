import { Route, Routes, Navigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { io, Socket } from "socket.io-client";
import jwtDecode from 'jwt-decode'
import { userResult } from './store/user'
import LeftSelector from './components/LeftSelector'
import FilesManager from './pages/filesManager'
import Dairy from './pages/dairy'
import Sign from './pages/Sign'
import './app.scss';
import { useEffect, useRef } from 'react';
import Friends from './pages/friends/index';
import {useState} from 'react';
import { addMessage, friendList, friendResult } from './store/friend';
export default function App() {

  const dispatch = useDispatch();

  const friend = useSelector(friendResult);

  const user = useSelector(userResult);
  //刷新页面储存redux中的数据
  useEffect(()=>{
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('users', JSON.stringify(user));
    });
  })

  const socket = useRef<Socket | null>(null);

  // 储存userId
  const [userMessage,setUserMessage] = useState<{
    id: number;
    name: string;
  } | undefined>();

  useEffect(()=>{
    if(user&&user.tokens){
      const {userMessage} = jwtDecode<{userMessage:[{id:number,name:string}]}>(user.tokens);
      const userId = userMessage[0].id;
      socket.current = io('http://localhost:8000');
      socket.current.emit('add-user',userId)
      setUserMessage(userMessage[0]);
    }
  },[user])

  // 加载用户列表，调用store里面的异步请求加载好友列表
  useEffect(()=>{
    // @ts-ignore
    if(Object.keys(friend).length===0&&user&&user.tokens)dispatch(friendList());
  },[user])

  // 接收消息
  useEffect(()=>{
    if (socket.current&&user&&user.tokens) {
      socket.current.on("msg-recieve", (msg:string) => {
        dispatch(addMessage(msg));
      });
    }
  },[user])

  return (
    <>
      {/* token鉴权 */}
      {
        !user || !user.tokens ? <Sign /> : null
      }
      {
        !(!user || !user.tokens) ?
        <div className="App container-fluid">
          <div className='row view-flex'>
            <LeftSelector />
            <Routes>
              <Route element={ <FilesManager/> } path="/filesManager" />
              <Route element={ <Dairy/> } path="/index" />
              <Route element={ <Friends socket={socket} userMessage={userMessage} /> } path="/friend" />
              <Route path='/' element={<Navigate to="/index"/>} />
            </Routes>
          </div>
        </div> : null
      }
    </>
  )
}