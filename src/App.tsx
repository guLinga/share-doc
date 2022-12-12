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
import { myFriendQuest, getFriendQuest, myFriendQuestResult, getFriendQuestResult } from './store/my_friend_quest';

const socketUrl = process.env.NODE_ENV === 'development' ?
'http://localhost:8000' : 'http://150.158.95.113:8000'

export default function App() {

  // 获取store中的数据
  const dispatch = useDispatch();
  const friend = useSelector(friendResult);
  const myQuest = useSelector(myFriendQuestResult);
  const getQuest = useSelector(getFriendQuestResult);
  const user = useSelector(userResult);

  //刷新页面储存redux中的数据
  useEffect(()=>{
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('users', JSON.stringify(user));
    });
  })

  // 定义socket.io
  const socket = useRef<Socket | null>(null);

  // 储存user信息
  const [userMessage,setUserMessage] = useState<{
    id: number;
    name: string;
  } | undefined>();

  // 发送socket.io连接
  useEffect(()=>{
    if(user&&user.tokens){
      const {userMessage} = jwtDecode<{userMessage:[{id:number,name:string}]}>(user.tokens);
      const userId = userMessage[0].id;
      socket.current = io(socketUrl);
      socket.current.emit('add-user',userId)
      setUserMessage(userMessage[0]);
    }
  },[user])

  // 用户关于笔友信息的异步遍历
  useEffect(()=>{
    // 加载用户列表，调用store里面的异步请求加载好友列表
    if(Object.keys(friend).length===0&&user&&user.tokens)dispatch(friendList());
    // 异步请求我发送的好友请求列表
    if(user&&user.tokens&&!myQuest.is)dispatch(myFriendQuest());
    // 遍历我收到的好友请求列表
    if(user&&user.tokens&&!getQuest.is)dispatch(getFriendQuest());
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