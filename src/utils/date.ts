export const getNowTimeStr = ():string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();

  const monthStr = month>10 ? month : `0${month}`;
  const dayStr = day>10 ? day : `0${day}`;
  
  return `${year}-${monthStr}-${dayStr}`;
}