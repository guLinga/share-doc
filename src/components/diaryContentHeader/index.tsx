import './index.scss'
import {useState} from 'react';
import { diaryContentHeaderProps } from './type';
export default function DiaryContentHeader({listText,setListText}:diaryContentHeaderProps) {
  // const list = ["日记","附件","音频","视频","聊天"];
  const list = ["日记","音频"];
  return (
    <div className="diaryContentHeader">
      {
        list.map((item,index)=>(
          <div key={index} className={listText===item?'diaryContentHeaderListActive diaryContentHeaderList':'diaryContentHeaderList'} onClick={()=>{
            setListText(item);
          }}>{item}</div>
        ))
      }
    </div>
  )
}
