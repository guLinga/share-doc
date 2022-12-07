import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';
import {props} from './type'
import { useState, useEffect, createContext } from 'react';

export const UserIdContext = createContext<{selectUserId:number|undefined,setSelectUserId:React.Dispatch<React.SetStateAction<number | undefined>>}|undefined>(undefined);

function Friends({socket,userId}:props) {

  // 输入框
  const [val,setVal] = useState('');

  const [selectUserId,setSelectUserId] = useState<number|undefined>(undefined);

  // 发送消息
  const send = () => {
    socket.current?.emit("send-msg",{
      to: selectUserId,
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
    <UserIdContext.Provider value={{selectUserId,setSelectUserId}}>
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
          {
            selectUserId!==undefined && 
            <>
              userId:{userId},selectUserId:{selectUserId}
              <input type="text" value={val} onChange={(e)=>{setVal(e.target.value)}} />
              <button onClick={send}>发送</button>
            </>
          }
        </div>
      </div>
    </UserIdContext.Provider>
  )
}

export default Friends
