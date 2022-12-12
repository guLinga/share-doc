import {useSelector} from 'react-redux'
import {myFriendQuestResult} from '../../store/my_friend_quest';

function MyFriendRequest() {

  // 获取我发送的好友请求列表
  const myQuestList = useSelector(myFriendQuestResult);
  const list = myQuestList.list;

  return (
    <>
      {
        Object.keys(list).map((idx)=>{
          const item = list[parseInt(idx)];
          return (
            <div key={item.friendId} className='itemVessels myFriendQuest'>
              <div className='name'>{item.name}</div>
              <div className='await'>等待验证</div>
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default MyFriendRequest