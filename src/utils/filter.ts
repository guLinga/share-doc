// 过滤聊天记录
export const filter = (msg:string) => {
  return msg.replace('<','&lt;').replace('>','&gt;').replace('\n','<br/>');
}