import './index.scss';
import IconFont from '../Icon/index';
import { unreadNum } from '../../store/friend';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


function LeftSelector() {

  const unread = useSelector(unreadNum);

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
            unread!==0&&<div className='num'>{
              unread>100?'...':unread
            }</div>
          }
        </NavLink>
      </div>
    </div>
  )
}

export default LeftSelector