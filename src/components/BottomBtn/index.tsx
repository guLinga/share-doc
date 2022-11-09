import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface props{
  text: string
  colorClass: string
  icon: IconProp
  callback:()=>void
  title?: string
}

function BottomBtn({text,colorClass,icon,callback,title}:props) {
  return (
    <button
      type='button'
      className={`btn btn-block no-border ${colorClass}`}
      style={{width: '100%'}}
      onClick={callback}
      title={title}
    >
      <FontAwesomeIcon
        className='mr-2'
        size='lg'
        icon={icon}
      />
      {text}
    </button>
  )
}

export default BottomBtn
