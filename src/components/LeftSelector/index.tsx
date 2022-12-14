import './index.scss';
import IconFont from '../Icon/index';
import { unreadNum } from '../../store/friend';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getFriendQuestResult } from '../../store/my_friend_quest';


function LeftSelector() {

  // 信息的未读
  const unread = useSelector(unreadNum);
  // 收到好友请求的未读
  const friendUnreadResult = useSelector(getFriendQuestResult);
  const friendUnread = friendUnreadResult.unread

  return (
    <div className='leftSelector'>
      <div className='fileManagement'>
        <NavLink to={'/filesManager'} className={({isActive})=>isActive?'leftNav item':'item'}>
          <IconFont type='icon-wenjianjia-copy' title="文件管理器" style={{"fontSize": "27px"}}/>
        </NavLink>
        <NavLink to={'/index'} className={({isActive})=>isActive?'leftNav item':'item'}>
          <IconFont type='icon-rili-copy' title="日记"/>
        </NavLink>
        <NavLink to={'/friend'} className={({isActive})=>isActive?'leftNav item':'item'}>
          <IconFont type='icon-xiaoxi-copy' title="笔友" style={{"fontSize": "27px"}}/>
          {
            (unread!==0||friendUnread!==0)&&<div className='num'>{
              unread>100?'...':unread + friendUnread
            }</div>
          }
        </NavLink>
      </div>
    </div>
  )
}

export default LeftSelector