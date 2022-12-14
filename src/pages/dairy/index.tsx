import './index.scss';
import Calendar from '../../components/Calendar/index';
import DiaryContent from '../../components/diaryContent/index';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

export default function Test() {

  //日历组件返回选中的日期
  const [date,setDate] = useState('');

  // 日期列表
  const [dateList,setDateList] = useState<string[]>();

  useEffect(()=>{
    (async function fn(){
      let result = await axios({url: '/diary/calendar'});
      if(result.data.data)setDateList(result.data.data);
    })()
  },[])

  return (
    <div className='dairy'>
      <div className='calendarVessels'>
        <Calendar width="100%" dataList={dateList} dayCilck={(day)=>{
          setDate(day);
        }}/>
      </div>
      <div className='diaryContents'>
          <DiaryContent date={date} setDateList={setDateList} dateList={dateList} />
      </div>
    </div>
  )
}
