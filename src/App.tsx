import { Route, Routes, Navigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { io, Socket } from "socket.io-client";
import jwtDecode from 'jwt-decode'
import { userResult } from './store/user'
import FilesManager from './pages/filesManager'
import Dairy from './pages/dairy'
import LeftSelector from './components/LeftSelector'//leftSelector的引入需要放到Dairy下面，否则会报错，Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization
import Sign from './pages/Sign'
import './app.scss';
import { useEffect, useRef } from 'react';
import Friends from './pages/friends/index';
import {useState} from 'react';
import { addMessage, friendList, friendResult, addUnread, addFriend } from './store/friend';
import { myFriendQuest, getFriendQuest, myFriendQuestResult, getFriendQuestResult, addGetFriendQuest, clearMyFriendQuest } from './store/my_friend_quest';
import axios from 'axios';
import Games from './pages/games';
import GamesContainer from './components/gamesContainer/index';

const socketUrl = process.env.NODE_ENV === 'development' ?
'http://localhost:8000' : 'http://150.158.95.113:8000'

export default function App() {

  // 获取store中的数据
  const dispatch = useDispatch();
  const friend = useSelector(friendResult);
  const myQuest = useSelector(myFriendQuestResult);
  const getQuest = useSelector(getFriendQuestResult);
  const user = useSelector(userResult);

  // 获取选择的用户id
  const [selectUserId,setSelectUserId] = useState<number|undefined>(undefined);

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
      // 这里取消监听"msg-recieve"，否则会存在多个监听，发送一条信息可以收到好几条
      socket.current.removeListener("msg-recieve");
      socket.current.removeListener("recivece_friend_quest");
      socket.current.removeListener("agree_friend_quest");

      // 接收发送的消息
      socket.current.on("msg-recieve", (msg:{id:number,data:{}}) => {
        console.log(msg);
        
        dispatch(addMessage(msg));
        // 如果已经打开了该好友的聊天窗口那么就将未读消息清空，且不向redux中添加未读数量
        if(msg.id===selectUserId){
          axios({
            url: '/friend/clearUnread',
            method: 'PUT',
            data: {
              friendId: msg.id
            }
          })
        }else{
          dispatch(addUnread({friendId:msg.id}));
        }
      });

      // 接收我收到的好友请求
      socket.current.on("recivece_friend_quest", (msg:{
        from: number
        to: number
        data: {
          friendId: number
          name: string
          updateAt: string
        }
      })=>{
        dispatch(addGetFriendQuest({
          id: msg.from,
          data: {
            friendId: msg.from,
            name: msg.data.name,
            updateAt: msg.data.updateAt,
            unread: 1
          }
        }));
      })

      // 接收同意的好友请求
      socket.current.on("agree_friend_quest", (msg:{
        from: number
        to: number,
        data: {
          name: string
        }
      })=>{
        console.log(msg);
        // 清除自身发送的好友请求列表数据
        dispatch(clearMyFriendQuest(msg));
        // 增加好友
        dispatch(addFriend({msg}));
      })
    }
  },[user,selectUserId])

  return (
    <>
      {/* token鉴权 */}
      {
        !user || !user.tokens ? <Sign /> : null
      }
      {
        !(!user || !user.tokens) ?
        <div className="App">
          <div className='view-flex'>
            <LeftSelector />
            <Routes>
              <Route element={ <FilesManager/> } path="/filesManager" />
              <Route element={ <Dairy/> } path="/index" />
              <Route element={ <Friends socket={socket} userMessage={userMessage} selectUserId={(id)=>{
                setSelectUserId(id)
              }} /> } path="/friend" />
              <Route element={ <Games/> } path="/games" />
              <Route element={ <GamesContainer/> } path="/games/container/:g" />
              <Route path='/' element={<Navigate to="/index"/>} />
            </Routes>
          </div>
        </div> : null
      }
    </>
  )
}