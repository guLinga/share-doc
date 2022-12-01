import './index.scss'
import DiaryContentHeader from '../diaryContentHeader/index';
import { useState, useEffect } from 'react';
import { diaryContentProps } from './type';
import ContentDiary from '../diaryContentMessage/contentDiary';
import ContentFiles from '../diaryContentMessage/contentFiles';
import ContentAudio from '../diaryContentMessage/contentAudio';
import ContentVideo from '../diaryContentMessage/contentVideo';
import ContentChat from '../diaryContentMessage/contentChat';
import axios from '../../utils/axios';
import { getNowTimeStr } from '../../utils/date';
export default function DiaryContent({date}:diaryContentProps) {
  const [listText,setListText] = useState<string>('日记');

  const [content,setContent] = useState('');

  useEffect(()=>{
    (async function fn(){
      setListText("日记");
      console.log('请求数据',date,listText);
      let result = await axios({
        url: '/diary/search',
        params: {
          time: date ? date : getNowTimeStr()
        }
      })
      if(result.data.data)
      setContent(result.data.data.article);
    })()
  },[date])

  // useEffect(()=>{
  //   console.log('请求数据',date,listText);
  // }, [listText])

  return (
    <div className='diaryContent'>
      <DiaryContentHeader
        listText={listText}
        setListText={setListText}
      />
      <div>
        {
          listText === '日记'&&
          <ContentDiary content={content} />
        }
        {
          listText === '附件'&&
          <ContentFiles />
        }
        {
          listText === '音频'&&
          <ContentAudio />
        }
        {
          listText === '视频'&&
          <ContentVideo />
        }
        {
          listText === '聊天'&&
          <ContentChat />
        }
      </div>
    </div>
  )
}


