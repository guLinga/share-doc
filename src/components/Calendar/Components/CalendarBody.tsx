import { CalendarBodyProps, children } from '../lib/type'
import './CalendarBody.scss'
import { getCalendatArr } from '../lib/utils';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WeekHeader from './WeekHeader';

export default function CalendarBody({
  years,months,dayCilcks,freezingDay,freezingMonth,freezingYear,dataList
}:CalendarBodyProps) {
  
  //获取日历列表
  const [calendar, setCalendar] = useState(getCalendatArr(years,months));

  //点击后的天数
  const [selectorDay, setSelectorDay] = useState("");

  //获取日历数组
  useEffect(()=>{
    setCalendar(getCalendatArr(years,months));
  },[years,months])

  //日历列表生成Set，使用set.has来判断
  const dataListSet = new Set(dataList);

  const dayClick = (children:children) => {
    if(children.is){
      let monthsStr = months>10 ? months : `0${months}`;
      let dayStr = children.value>10 ? children.value : `0${children.value}`;
      const date = `${years}-${monthsStr}-${dayStr}`;
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
                      // 判断是否是列表的日期
                      (
                        dataListSet.has(`${years}-${months>10?months:'0'+months}-${children.value>10?children.value:'0'+children.value}`)
                      ) ? 'listItemIs list' :
                      //判断是否为选中的日期
                      (
                        `${years}-${months>10?months:'0'+months}-${children.value>10?children.value:'0'+children.value}` === selectorDay?
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
