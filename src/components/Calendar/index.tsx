//日历组件
import {useState} from 'react';
import CalendarHeader from './Components/CalendarHeader';
import { getNowTime } from './lib/utils';
import './index.scss';
import CalendarBody from './Components/CalendarBody';
import { calendarProps } from './lib/type';
export default function Calendar({dataList,width,height,style,className,dayCilck}:calendarProps) {

  // 获取当前的时间
  const {year,month,day} = getNowTime();

  //设置年份日期
  const [years, setYears] = useState(year);

  //设置月份
  const [months, setMonths] = useState(month);

  return (
    <div className={`canlendarVessels ${className}`} style={{width,height,...style}}>
      <CalendarHeader
        freezingYear={year}
        freezingMonth={month}
        years={years}
        months={months}
        setYears={(year:number)=>{setYears(year)}}
        setMonths={(month:number)=>{setMonths(month)}}
      />
      <CalendarBody
        dataList={dataList}
        years={years}
        months={months}
        freezingYear={year}
        freezingMonth={month}
        freezingDay={day}
        dayCilcks={(day)=>{
          dayCilck && dayCilck(day)
        }}
      />
    </div>
  )
}
