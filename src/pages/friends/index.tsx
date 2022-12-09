import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';
import {props} from './type'
import { useState, createContext, useRef, useEffect } from 'react';
import {Input} from 'antd';
import { RightBtn } from './component';

const { TextArea } = Input;

// 层级传递点击好友的id
export const UserIdContext = createContext<{selectUser:{userId:number,name:string}|undefined,setSelectUser:React.Dispatch<React.SetStateAction<{userId:number,name:string}|undefined>>}|undefined>(undefined);

function Friends({socket,userId}:props) {

  // 输入框
  const inputEl = useRef(null);

  // 点击笔友的id
  const [selectUser,setSelectUser] = useState<{userId:number,name:string}|undefined>(undefined);

  // 发送消息
  const send = () => {
    //@ts-ignore
    const val = inputEl.current.resizableTextArea.textArea.value;
    
    socket.current?.emit("send-msg",{
      to: selectUser?.userId,
      from: userId,
      msg: val
    })
  }

  // 当好友id变化时将输入框变空
  useEffect(()=>{
    if(inputEl.current)
    // @ts-ignore
    inputEl.current.resizableTextArea.textArea.value = '';
  },[selectUser?.userId])

  return (
    <UserIdContext.Provider value={{selectUser,setSelectUser}}>
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
            selectUser!==undefined && 
            <>
              <div className='chat'>
              <div className='header'>{selectUser.name}</div>
                <div className='message'></div>
                {/* <div className='message white-space:pre' dangerouslySetInnerHTML={{__html: test.replace(/\n/g, '<br/>')}}></div> */}
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
