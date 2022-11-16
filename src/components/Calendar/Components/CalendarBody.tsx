import { CalendarBodyProps, children } from '../lib/type'
import './CalendarBody.scss'
import { getCalendatArr } from '../lib/utils';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WeekHeader from './WeekHeader';

export default function CalendarBody({
  years,months,dayCilcks,freezingDay,freezingMonth,freezingYear
}:CalendarBodyProps) {
  
  //获取日历列表
  const [calendar, setCalendar] = useState(getCalendatArr(years,months));

  //点击后的天数
  const [selectorDay, setSelectorDay] = useState("");

  useEffect(()=>{
    setCalendar(getCalendatArr(years,months));
  },[years,months])

  const dayClick = (children:children) => {
    if(children.is){
      const date = `${years}-${months}-${children.value}`;
      setSelectorDay(date);
      dayCilcks(date);
    }
  }

  return (
    <div className='calendarBody'>
      <WeekHeader />
      {
        calendar.map((parent)=>(
          parent.map((children)=>{
            const id = uuidv4();
            return (
              <div
                key={id}
                className={
                  //判断是否为灰色
                  children.is?
                    //判断是否为今天的日期
                    (
                      years===freezingYear&&
                      months===freezingMonth&&
                      children.value===freezingDay
                    ) ? 'listItemIs now' :
                      //判断是否为选中的日期
                      (
                        `${years}-${months}-${children.value}` === selectorDay?
                        'listItemIs selector' : 'listItemIs is'
                      )
                  :'listItemNo no'
                }
                onClick={()=>{
                  dayClick(children)
                }}
              >
                <span>{children.value}</span>
              </div>
            )
          })
        ))
      }
    </div>
  )
}
