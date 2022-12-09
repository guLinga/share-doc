import { useEffect, useContext } from 'react';
import { friendList, friendResult } from '../../store/friend';
import { useDispatch, useSelector } from 'react-redux';
import { UserIdContext } from '../../pages/friends/index';

function FriendAllList() {
  const dispatch = useDispatch();

  // 获取好友列表
  const friend = useSelector(friendResult);

  // 获取Context中的好友id和set好友id
  const selectUser = useContext(UserIdContext);

  // 加载用户列表，调用store里面的异步请求加载好友列表
  useEffect(()=>{
    //@ts-ignore
    if(Object.keys(friend).length===0)dispatch(friendList());
  },[])

  return (
    <>
      {
        Object.keys(friend).map((key)=>{
          const item = friend[parseInt(key)];
          return (
            <div key={item.friendId} className={
              selectUser?.selectUser?.userId===item.friendId ? 'itemVessels itemAction' : 'itemVessels'
            } onClick={()=>{
              selectUser?.setSelectUser({
                userId: item.friendId,
                name: item.name
              })
            }}>
              <div className='name'>{item.name}</div>
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default FriendAllList