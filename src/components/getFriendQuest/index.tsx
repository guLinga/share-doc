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
            <div key={item.friendId} className='itemVessels'>
              <div className='name'>{item.name}</div>
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default GetFriendQuest