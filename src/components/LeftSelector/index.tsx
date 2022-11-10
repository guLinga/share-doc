import React from 'react'
import './index.scss';
import IconFont from '../Icon/index';

interface props{
  setLeftListOpen: ()=>void
}

function LeftSelector({setLeftListOpen}:props) {
  return (
    <div className='leftSelector'>
      <div className='fileManagement'>
        <IconFont type='icon-wenjianjia' onClick={setLeftListOpen} title="文件管理器"/>
      </div>
    </div>
  )
}

export default LeftSelector