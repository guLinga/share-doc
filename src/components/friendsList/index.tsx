import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext } from 'react';
import { friendList, friendResult } from '../../store/friend';
import { UserIdContext } from '../../pages/friends/index';

function FriendsList() {
  const dispatch = useDispatch();
  const friend = useSelector(friendResult);

  const selectUser = useContext(UserIdContext);

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
            <div key={item.friendId} onClick={()=>{
              selectUser?.setSelectUserId(item.friendId);
            }}>
              {item.name}-{item.updateAt}
            </div>
          )
        })
      }
    </div>
  )
}

export default FriendsList
