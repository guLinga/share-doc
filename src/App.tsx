import { Route, Routes, Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
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
export default function App() {
  const user = useSelector(userResult);
  //刷新页面储存redux中的数据
  useEffect(()=>{
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('users', JSON.stringify(user));
    });
  })

  const socket = useRef<Socket | null>(null);

  // 储存userId
  const [userId,setUserId] = useState<number | undefined>();

  useEffect(()=>{
    if(user&&user.tokens){
      const {userMessage} = jwtDecode<{userMessage:[{id:number,name:string}]}>(user.tokens);
      const userId = userMessage[0].id;
      socket.current = io('http://localhost:8000');
      socket.current.emit('add-user',userId)
      setUserId(userId);
      console.log('userId',userId);
    }
  },[user])

  // 接收消息
  useEffect(()=>{
    if (socket.current) {
      socket.current.on("msg-recieve", (msg:string) => {
        console.log('msg-recieve-msg:',msg);
      });
    }
  },[socket.current])

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
              <Route element={ <Friends socket={socket} userId={userId} /> } path="/friend" />
              <Route path='/' element={<Navigate to="/index"/>} />
            </Routes>
          </div>
        </div> : null
      }
    </>
  )
}