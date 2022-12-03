import './index.scss';
import IconFont from '../Icon/index';
import { Link,NavLink } from 'react-router-dom';


function LeftSelector() {
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
        </NavLink>
      </div>
    </div>
  )
}

export default LeftSelector