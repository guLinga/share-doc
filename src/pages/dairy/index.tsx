import './index.scss';
import Calendar from '../../components/Calendar/index';
import DiaryContent from '../../components/diaryContent/index';
import {useState} from 'react';

export default function Test() {
  const [date,setDate] = useState('');
  return (
    <div className='dairy'>
      <div className='calendarVessels'>
        <Calendar width="100%" dayCilck={(day)=>{
          setDate(day);
        }}/>
      </div>
      <div>
          <DiaryContent date={date} />
      </div>
    </div>
  )
}
