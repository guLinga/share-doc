import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';
import {props} from './type'
import { useState, useEffect, createContext, useRef } from 'react';
import {Input} from 'antd';
import { RightBtn } from './component';
import { TextAreaRef, TextAreaProps } from 'antd/es/input/TextArea';

const { TextArea } = Input;

export const UserIdContext = createContext<{selectUserId:number|undefined,setSelectUserId:React.Dispatch<React.SetStateAction<number | undefined>>}|undefined>(undefined);

function Friends({socket,userId}:props) {

  // 输入框
  const inputEl = useRef(null);

  const [selectUserId,setSelectUserId] = useState<number|undefined>(undefined);

  // 发送消息
  const send = () => {
    //@ts-ignore
    const val = inputEl.current.resizableTextArea.textArea.value;
    //@ts-ignore
    console.log(String(inputEl.current.resizableTextArea.textArea.value));
    
    socket.current?.emit("send-msg",{
      to: selectUserId,
      from: userId,
      msg: val
    })
  }

  // 接收消息
  useEffect(()=>{
    if (socket.current) {
      socket.current.on("msg-recieve", (msg:string) => {
        console.log('msg-recieve-msg:',msg,msg.replace('\n','<br>'));
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
              <div className='chat'>
              <div className='header'>昵称</div>
                <div className='message white-space:pre'></div>
                <div className='send'>
                  <TextArea ref={inputEl} style={{height:'100%'}} rows={4}/>
                  <RightBtn type='primary' onClick={send}>发送</RightBtn>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </UserIdContext.Provider>
  )
}

export default Friends
