import { Button } from "antd";
import { useSelector } from "react-redux";
import { getFriendQuestResult } from "../../store/my_friend_quest";

function GetFriendQuest() {

  // 获取我收到的好友请求列表
  const getQuestList = useSelector(getFriendQuestResult);
  const list = getQuestList.list;
  
  return (
    <>
      {
        Object.keys(list).map((idx)=>{
          const item = list[parseInt(idx)];
          return (
            <div key={item.friendId} className='itemVessels gerFriendQuest'>
              <div className='name'>{item.name}</div>
              <Button type="primary" size="small" className="yes">同意</Button>
              <Button type="primary" size="small" danger className="no">拒绝</Button>
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default GetFriendQuest