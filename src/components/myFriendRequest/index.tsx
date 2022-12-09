import {useSelector, useDispatch} from 'react-redux'
import {myFriendQuest, myFriendQuestResult} from '../../store/my_friend_quest';
import { useEffect } from 'react';

function MyFriendRequest() {

  const dispatch = useDispatch();

  // 获取我发送的好友请求列表
  const muQuestList = useSelector(myFriendQuestResult);

  // 异步请求我发送的好友请求列表
  useEffect(()=>{
    // @ts-ignore
    dispatch(myFriendQuest());
  },[])

  return (
    <>
      {
        muQuestList.map((item)=>{
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

export default MyFriendRequest