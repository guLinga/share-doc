import { Button } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from "../../store/friend";
import { clearGetFriendQuest, getFriendQuestResult } from "../../store/my_friend_quest";
import { $emit } from "../../utils/eventBus";
import { ALL } from "../friendsList";
import { props } from "./type";

function GetFriendQuest({socket,userMessage,setKey}:props) {

  const dispatch = useDispatch();

  // 获取我收到的好友请求列表
  const getQuestList = useSelector(getFriendQuestResult);
  const list = getQuestList.list;

  // 同意
  const agree = async (friendId:number) => {
    // 清除自身收到的好友请求列表数据
    dispatch(clearGetFriendQuest({friendId}));
    // 向好友发送添加成功好友的消息
    socket.current?.emit("agree_friend_quest",{
      to: friendId,
      from: userMessage?.id,
      data: {
        name: userMessage?.name
      }
    })

    // 消息发送成功后socket向对方发送消息
    socket.current?.emit("send-msg",{
      to: friendId,
      from: userMessage?.id,
      msg: {id: userMessage?.id,data:{
        friendId: friendId,
        userId: userMessage?.id,
        message: '我们已经是好友啦，一起来聊天吧！',
        updateAt: '',
        id: 'test'
      }}
    })
    // 消息发送成功后，调用store的方法，向自身的store添加数据
    // dispatch(addMessage({id: friendId,data:{
    //   friendId: friendId,
    //   userId: userMessage?.id,
    //   message: '我们已经是好友啦，一起来聊天吧！',
    //   updateAt: '',
    //   id: 'test'
    // }}));

    // 切换到消息
    setKey(ALL);

  }
  
  return (
    <>
      {
        Object.keys(list).map((idx)=>{
          const item = list[idx];
          return (
            <div key={item.friendId} className='itemVessels gerFriendQuest'>
              <div className='name'>
                <span className="relative">
                  {item.name}
                  {
                    item.unread!==0&&<div className="point"></div>
                  }
                </span>
              </div>
              <Button type="primary" size="small" className="yes" onClick={()=>{agree(item.friendId)}}>同意</Button>
              {/* <Button type="primary" size="small" danger className="no">拒绝</Button> */}
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default GetFriendQuest