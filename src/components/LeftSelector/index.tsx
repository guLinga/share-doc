import './index.scss';
import IconFont from '../Icon/index';
import { Link } from 'react-router-dom';


function LeftSelector() {
  return (
    <div className='leftSelector'>
      <div className='fileManagement'>
        <Link to={'/filesManager'}>
          <IconFont type='icon-wenjianjia' title="文件管理器"/>
        </Link>
        <Link to={'/dairy'}>
          <IconFont type='icon-wenjianjia' title="dairy"/>
        </Link>
      </div>
    </div>
  )
}

export default LeftSelector