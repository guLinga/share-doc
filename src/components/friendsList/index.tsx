import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { friendList, friendResult } from '../../store/friend';

function FriendsList() {
  const dispatch = useDispatch();
  const friend = useSelector(friendResult);

  // 加载用户列表
  useEffect(()=>{
    //@ts-ignore
    dispatch(friendList());
  },[])

  useEffect(()=>{
    console.log('friend',friend);
  },[friend])

  return (
    <div id='friendsList'>
      {
        friend.map((item)=>{
          return (
            <div key={item.friendId}>
              {item.name}-{item.updateAt}
            </div>
          )
        })
      }
    </div>
  )
}

export default FriendsList
