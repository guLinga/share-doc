import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import { useContextMenu } from '../../hooks/useContextMenu';
import { getParentNode } from '../../utils/helper';
import IconFont from '../Icon/index';
import './index.scss';
import {defaultFiles} from '../../utils/defaultFiles';

interface files {
  id: string
  title: string
  body?: string
  isNew?: boolean
}

interface props {
  files: defaultFiles
  onFileClick: (id: string) => void
  onSaveEdit: (id: string, value:string, isNew: boolean) => void
  onFileDelete: (id: string) => void
  isNewFile: string
  setIsNewFile: (id:string)=>void
}

function FileList({ files, onFileClick, onSaveEdit, onFileDelete,isNewFile, setIsNewFile }: props) {
  const [editStatus, setEditStatus] = useState('');
  const [value, setValue] = useState('');

  const closeSearch = (editItem: files | undefined) => {
    setEditStatus('');
    setValue('');
    //如果是新创建的文件，点击esc或叉号就删除该文件
    if(editItem?.isNew){
      onFileDelete(editItem.id);
    }
  }
  
  //右键出现选择菜单
  const clickedItem = useContextMenu([{
    label: '打开',
    click: () => {
      const parentElement = getParentNode(clickedItem.current, 'file-item');
      const {id} = parentElement?.dataset || {};
      if(id){
        onFileClick(id);
      }
    }
  },{
    label: '重命名',
    click: () => {
      const parentElement = getParentNode(clickedItem.current, 'file-item');
      const {id, title} = parentElement?.dataset || {};
      if(id && title){
        //复制重命名的id
        setIsNewFile(id);
        setValue(title);
        setEditStatus(id);
      }
    }
  },{
    label: '删除',
    click: () => {
      const parentElement = getParentNode(clickedItem.current, 'file-item');
      const {id} = parentElement?.dataset || {};
      if(id){
        onFileDelete(id);
      }
    }
  }], '.file-list', files)

  //修改的回车和退出
  const handleKeyUp = (event:React.KeyboardEvent<HTMLInputElement>) => {
    const {key} = event;
    const editItem = files[isNewFile];
    if(key === 'Enter' && isNewFile!=='' && value.trim()!==''){
      onSaveEdit(isNewFile, value, editItem?.isNew || false);
      setValue('');
      setEditStatus('');
    }else if(key === 'Escape' && editStatus!==''){
      closeSearch(editItem);
    }
  }

  // useEffect(() => {
  //   const newFile = files?.find(file => file.isNew);
  //   if(newFile){
  //     setEditStatus(newFile.id);
  //     setValue(newFile.title);
  //   }
  // }, [files])

  return (
    <ul id='fileList' className='file-list'>
      {
        files &&
        Object.keys(files)?.map(id => {
          const file = files[id];
          return(
            <li
              className="fileListItem file-item"
              key={id}
              data-id={file.id}
              data-title={file.title}
              onClick={() => { onFileClick(file.id) }}
            >
              {
                (file.id !== editStatus && !file.isNew) &&
                <>
                  <span className='fileListItemIcon'>
                    <IconFont type='icon-markdown' />
                  </span>
                  <span
                    className=''
                  >{file.title}</span>
                </>
              }
              {
                (file.id === editStatus || file.isNew) &&
                <>
                  <input 
                    value={value}
                    className="col-10"
                    style={{border: 'none'}}
                    placeholder="请输入文件名"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                      setValue(e.target.value)
                    }}
                    onKeyUp={(e)=>{
                      handleKeyUp(e)
                    }}
                  />
                  <button type='button' className='icon-button col-2' onClick={()=>{closeSearch(file)}}>
                    <FontAwesomeIcon title='关闭' size='lg' icon={faTimes} />
                  </button>
                </>
              }
            </li>
          )
        })
      }
    </ul>
  )
}

export default FileList