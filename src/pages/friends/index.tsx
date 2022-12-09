import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';
import {props} from './type'
import {friendResult} from '../../store/friend';
import { chatList as chatLists, addMessage } from '../../store/friend';
import { useState, createContext, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Input} from 'antd';
import { RightBtn } from './component';
import axios from '../../utils/axios';

const { TextArea } = Input;

// 层级传递点击好友的id
export const UserIdContext = createContext<{selectUser:{userId:number,name:string}|undefined,setSelectUser:React.Dispatch<React.SetStateAction<{userId:number,name:string}|undefined>>}|undefined>(undefined);

function Friends({socket,userMessage}:props) {

  const dispatch = useDispatch();

  // 输入框
  const inputEl = useRef(null);

  // 点击笔友的id
  const [selectUser,setSelectUser] = useState<{userId:number,name:string}|undefined>(undefined);

  // 用户聊天列表
  const chatList = useSelector(friendResult);
  const userChatList = selectUser?.userId ? chatList[selectUser?.userId].chat : [];

  // 发送消息
  const send = async () => {
    //@ts-ignore
    const val = inputEl.current.resizableTextArea.textArea.value;
    let result = await axios({
      url: '/friend/send',
      method: 'POST',
      data: {
        friendId: selectUser?.userId,
        message: val
      }
    })
    console.log(result);
    
    if(result.data.code===200){
      // 消息发送成功后socket向对方发送消息
      socket.current?.emit("send-msg",{
        to: selectUser?.userId,
        from: userMessage?.id,
        msg: {id: selectUser?.userId,data:{
          friendId: selectUser?.userId,
          userId: userMessage?.id,
          message: val,
          updateAt: '',
          id: result.data.data[0].insertId,
        }}
      })
      // 消息发送成功后，调用store的方法，向自身的store添加数据
      dispatch(addMessage({id: selectUser?.userId,data:{
        friendId: selectUser?.userId,
        userId: userMessage?.id,
        message: val,
        updateAt: '',
        id: result.data.data[0].insertId,
      }}));
      // 发送成功后将输入框信息清空
      // @ts-ignore
      inputEl.current.resizableTextArea.textArea.value = '';
    }
  }

  useEffect(()=>{
    // 当好友id变化时将输入框变空
    if(inputEl.current)
    // @ts-ignore
    inputEl.current.resizableTextArea.textArea.value = '';
    // 当好友id变化时，判断是否需要异步请求聊天记录
    if(selectUser?.userId&&!chatList[selectUser?.userId].is){
      //异步请求获取聊天记录
      // @ts-ignore
      dispatch(chatLists(selectUser.userId));
    }
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
                <div className='message'>
                  {
                    userChatList?.map((item)=>{
                      return (
                        <div className={item.userId===userMessage?.id?'rightVessels messageVessels':'leftVessels messageVessels'} key={item.id}>
                          {
                            item.userId === userMessage?.id &&<>
                              <div className='messageContent'>{item.message}</div>
                              <div className='headerName'>{userMessage.name[0]}</div>
                            </>
                          }
                          {
                            item.userId === selectUser.userId && <>
                              <div  className='headerName'>{selectUser.name[0]}</div>
                              <div  className='messageContent'>{item.message}</div>
                            </>
                          }
                        </div>
                      )
                    })
                  }
                </div>
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
