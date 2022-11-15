//日历组件
import {useState} from 'react';
import CalendarHeader from './Components/CalendarHeader';
import { getNowTime } from './lib/utils';
import './index.scss';
import CalendarBody from './Components/CalendarBody';
import { calendarProps } from './lib/type';
export default function Calendar({width,height,style,className}:calendarProps) {

  const {year,month,day} = getNowTime();

  //设置年份日期
  const [years, setYears] = useState(year);

  //设置月份
  const [months, setMonths] = useState(month);

  //设置天
  const [days, setDays] = useState(day);

  return (
    <div className={`canlendarVessels ${className}`} style={{width,height}}>
      <CalendarHeader
        years={years}
        months={months}
        setYears={(year:number)=>{setYears(year)}}
        setMonths={(month:number)=>{setMonths(month)}}
      />
      <CalendarBody
        years={years}
        months={months}
      />
    </div>
  )
}
