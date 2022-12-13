import { useContext } from 'react';
import { friendResult,clearUnread } from '../../store/friend';
import { useSelector, useDispatch } from 'react-redux';
import { UserIdContext } from '../../pages/friends/index';
import axios from 'axios';

function FriendAllList() {

  const dispatch = useDispatch();

  // 获取好友列表
  const friend = useSelector(friendResult);

  // 获取Context中的好友id和set好友id
  const selectUser = useContext(UserIdContext);

  // 点击好友列表
  const selectFriend = async (friendId:number,name:string,unread:number) => {
    selectUser?.setSelectUser({
      userId: friendId,
      name: name
    })
    // 清除未读消息
    if(unread!==0){
      let result = await axios({
        url: '/friend/clearUnread',
        method: 'PUT',
        data: {
          friendId
        }
      })
      if(result.data.code===200){
        dispatch(clearUnread({friendId}));
      }
    }
  }

  return (
    <>
      {
        Object.keys(friend).map((key)=>{
          const item = friend[key];
          return (
            <div key={item.friendId} className={
              selectUser?.selectUser?.userId===item.friendId ? 'itemVessels itemAction' : 'itemVessels'
            } onClick={()=>{
              selectFriend(item.friendId,item.name,item.unread)
            }}>
              <div className='name'>{item.name}</div>
              <div className='time'>{item.updateAt.replace('T',' ').replace('.000Z','')}</div>
              {
                item.unread!==0&&<div className='unread'>
                  {item.unread>100?'...':item.unread}
                </div>
              }
            </div>
          )
        })
      }
    </>
  )
}

export default FriendAllList