import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import './index.scss';
import {defaultFiles} from '../../utils/defaultFiles';
import IconFont from '../Icon/index';

interface props{
  files: defaultFiles
  activeId: string
  unsaveIds: string[]
  onTabClick: (id:string)=>void
  onCloseTab: (id:string)=>void
}

function TabList({files,activeId,unsaveIds,onTabClick,onCloseTab} : props) {
  
  return (
    <ul className="nav nav-paills tablist-component">
      {
        Object.keys(files)?.map(id => {
          const file = files[id];
          const withUnsavedMark = unsaveIds.includes(file?.id || '');
          const fClassName = classNames({
            'nav-link': true,
            'active-my': file?.id === activeId,
            'withUnsaved': withUnsavedMark,
            'navTabColor': true
          })
          return (
            <li className="nav-item" key={file?.id}>
              <a
                href="#"
                className={fClassName}
                onClick={(e)=>{
                  e.preventDefault();
                  onTabClick(file?.id || '')
                }}
              >
                <span className='navTabIcon'>
                  <IconFont type='icon-markdown' />
                </span>
                {file?.title}
                <span
                  className='close-icon'
                  onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    onCloseTab(file?.id || '');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                  />
                </span>
                { withUnsavedMark && <span className='rounded-circle unsaved-icon'></span> }
              </a>
            </li>
          )
        })
      }
    </ul>
  )
}

export default TabList