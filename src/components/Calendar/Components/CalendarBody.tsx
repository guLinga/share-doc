import { CalendarBodyProps } from '../lib/type'
import './CalendarBody.scss'
import { getCalendatArr } from '../lib/utils';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WeekHeader from './WeekHeader';

export default function CalendarBody({years,months}:CalendarBodyProps) {
  
  const [calendar, setCalendar] = useState(getCalendatArr(years,months));

  useEffect(()=>{
    setCalendar(getCalendatArr(years,months));
  },[years,months])

  return (
    <div className='calendarBody'>
      <WeekHeader />
      {
        calendar.map((parent)=>(
          parent.map((children)=>{
            const id = uuidv4();
            return (
              <div key={id} className={children.is?'listItemIs is':'listItemNo no'}>
                <span>{children.value}</span>
              </div>
            )
          })
        ))
      }
    </div>
  )
}
