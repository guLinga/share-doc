import React, { useEffect, useState, useRef } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';

interface props{
  title: string
  onFileSearch: (value:string)=>void
}

function FileSearch({ title, onFileSearch } : props) {
  //是否搜索
  const [ inputActive, setInputActive ] = useState(false);
  //搜索的值
  const [ value, setValue ] = useState('');
  //输入框
  const node = useRef<HTMLInputElement>(null);

  //关闭搜索
  const closeSearch = () => {
    setInputActive(false);
    setValue('');
    //搜索空字符
    onFileSearch('');
  }


  //搜索的回车和退出
  const handleKeyUp = (event:React.KeyboardEvent<HTMLInputElement>) => {
    const {key} = event;
      if(key === 'Enter' && inputActive){
        onFileSearch(value);
      }else if(key === 'Escape' && inputActive){
        closeSearch();
      }
  }

  
  //点击搜索，触发焦点
  useEffect(() => {
    if(inputActive){
      node.current?.focus();
    }
  }, [inputActive])


  // useEffect(() => {
  //   const handleInputEvent = (event:KeyboardEvent) => {
  //     const {key} = event;
  //     if(key === 'Enter' && inputActive){
  //       onFileSearch(value);
  //     }else if(key === 'Escape' && inputActive){
  //       closeSearch();
  //     }
  //   }
  //   document.addEventListener('keyup', handleInputEvent);
  //   return () => {
  //     document.removeEventListener('keyup', handleInputEvent);
  //   }
  // })

  
  return (
    <div className='alert alert-primary d-flex justify-content-between align-items-center'>
      {
        !inputActive && 
        <>
          <span>{ title }</span>
          <button type='button' className='icon-button' onClick={() => {setInputActive(true)}}>
            <FontAwesomeIcon title='搜索' size='lg' icon={faSearch}/>
          </button>
        </>
      }
      {
        inputActive && 
        <>
          <input 
            ref={node}
            value={value}
            style={{width: '100%',border: 'none'}}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setValue(e.target.value)}}
            onKeyUp={(e)=>{handleKeyUp(e)}}
          />
          <button type='button' className='icon-button' onClick={()=>{closeSearch()}}>
            <FontAwesomeIcon title='关闭' size='lg' icon={faTimes} />
          </button>
        </>
      }
    </div>
  )
}

export default FileSearch