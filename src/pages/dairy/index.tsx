import './index.scss';
import Calendar from '../../components/Calendar/index';

export default function Test() {
  return (
    <div className='dairy'>
      <div className='calendarVessels'>
        <Calendar width="100%" dayCilck={(day)=>{
          console.log(day);
        }}/>
      </div>
      <div>111</div>
    </div>
  )
}
