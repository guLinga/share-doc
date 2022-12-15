const event:{
  [key:string]: ((data:any)=>void)[]
} = {};

// 监听
export const $on = (eventName:string,callback:(data:any)=>void) => {
  if(!event[eventName]){
    event[eventName] = [];
  }
  event[eventName].push(callback);
}

// 发送
export const $emit = (eventName:string,data:any) => {
  if(!event[eventName])return;
  event[eventName].forEach(callback=>callback(data));
}

// 断开连接
export const $off = (eventName:string,callback?:(data:any)=>void) => {
  // 如果没传回调函数则删除所有连接
  if(!callback){
    delete event[eventName];
  }
  event[eventName] = event[eventName].filter((cd)=>{
    return cd!==callback
  });
}