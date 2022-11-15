import { weekEnum, calendarAll, calenderResult } from './type';
//星期
enum weeks{
  'Mon','Tue','Wed','Thu','Fri','Sat','Sun'
}

//获取当前年月日
export const getNowTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDay();
  return {
    year,
    month,
    day,
  }
}

//将月份转换成英文
export const changeEnglish = (month:number) => {
  const monthArr:string[] = [
    '',
    'January','February','March','April',
    'May','June','July','August',
    'September','October','November','December'
  ];
  return monthArr[month];
}

//获取一月有多少天
export const getMonthDay = (year:number,month:number) => {
  return new Date(year,month,0).getDate();
}

//获取一月的第一天是星期几
export const getMonthFistDayWeek = (year:number,month:number) => {
  //@ts-ignore
  let temp:weekEnum = String(new Date(year,month-1,1)).split(" ")[0]
  return weeks[temp]+1
}

//获取上一月的后几天
export const lastMonthEndDays = (year:number,month:number,lastNum:number):calendarAll[] => {
  if(lastNum===0)return []
  if(month===1){
    year--;
    month=12;
  }
  const startDay = new Date(year,month-1,-lastNum+1).getDate();
  return new Array(lastNum).fill(0).map((_,idx)=>{
    return {
      value: startDay+idx,
      is: false
    }
  })
}

//获取一月整个日历的显示
export const getCalendatArr = (year:number,month:number):calenderResult => {
  let result = [];
  //获取第一天是星期几
  let startWeek = getMonthFistDayWeek(year,month);
  //获取日历第一行数组
  let startArr = new Array(8-startWeek).fill(0).map((_,idx)=>{
    return {
      value: 1+idx,
      is: true
    }
  })
  //获取上一月最后几天
  let lastMonthEnd = lastMonthEndDays(year,month,startWeek-1);
  //拼接第一行日历
  let firstRowArr = [...lastMonthEnd,...startArr];
  //获取这一月的天数
  let dayAll = getMonthDay(year,month);

  let otherRowArr = new Array(5).fill(0).map(()=>new Array(7));
  
  let idx = 9-startWeek;
  let is = true;

  for(let i=0;i<5;i++){
    let temp = [];
    for(let j=1;j<=7;j++){
      temp.push({
        value: idx++,
        is
      });
      if(idx>dayAll){
        idx = 1;
        is = false;
      }
    }
    otherRowArr[i] = temp;
  }

  result = [firstRowArr,...otherRowArr];

  return result;
}

