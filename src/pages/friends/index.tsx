import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';
import {props} from './type'
import { useState, useEffect } from 'react';

function Friends({socket,userId}:props) {

  // 输入框
  const [val,setVal] = useState('');

  // 发送消息
  const send = () => {
    socket.current?.emit("send-msg",{
      to: userId,
      from: userId,
      msg: val
    })
  }

  // 接收消息
  useEffect(()=>{
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log('msg-recieve-msg:',msg);
      });
    }
  },[socket.current])

  return (
    <div id="friends">
      <Resizable
        defaultSize={{
          width: 320,
          height: '',
        }}
        style={{height: '100vh', overflow: 'hidden', backgroundColor: 'white', padding: "0", borderRight: '2px solid #e5e5ee'}}
        minWidth="260"
        maxHeight="100%"
        maxWidth="60%"
        minHeight="100%"
      >
        <FriendsListVessles />
      </Resizable>
      <div className='right'>
        <input type="text" value={val} onChange={(e)=>{setVal(e.target.value)}} />
        <button onClick={send}>发送</button>
      </div>
    </div>
  )
}

export default Friends
