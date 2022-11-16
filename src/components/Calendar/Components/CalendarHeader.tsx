import { calendatHeaderProps } from '../lib/type'
import { changeEnglish } from '../lib/utils';
import './CalendarHeader.scss'
import IconFont from '../../Icon/index';

export default function CalendarHeader({
  years,months,setMonths,setYears,
  freezingYear,freezingMonth
}:calendatHeaderProps) {

  //日历的前进和后退
  const handel = (direction:"up"|"down") => {
    switch(direction){
      case "up":
        if(years===freezingYear&&months===freezingMonth)return;
        if(months===12){
          setYears(years+1);
          setMonths(1);
        }else{
          setMonths(months+1);
        }
      break;
      case "down":
        if(months===1){
          setYears(years-1);
          setMonths(12);
        }else{
          setMonths(months-1);
        }
    }
  }

  return (
    <div className='calendatHeaderVessels'>
      <div className='headerMessage left'><IconFont type='icon-xiangzuo' onClick={()=>{handel("down")}} /></div>
      <div className='headerMessage'>{changeEnglish(months)}{years}</div>
      <div className='headerMessage right'><IconFont type='icon-right' onClick={()=>{handel("up")}} /></div>
    </div>
  )
}
