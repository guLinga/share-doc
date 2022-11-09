import React from 'react'
import './index.scss';

interface props{
  setLeftListOpen: ()=>void
}

function LeftSelector({setLeftListOpen}:props) {
  return (
    <div className='leftSelector'>
      <button onClick={setLeftListOpen} title="文件管理器">点击</button>
    </div>
  )
}

export default LeftSelector