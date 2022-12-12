import { useContext } from 'react';
import { friendResult } from '../../store/friend';
import { useSelector } from 'react-redux';
import { UserIdContext } from '../../pages/friends/index';

function FriendAllList() {

  // 获取好友列表
  const friend = useSelector(friendResult);

  // 获取Context中的好友id和set好友id
  const selectUser = useContext(UserIdContext);

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