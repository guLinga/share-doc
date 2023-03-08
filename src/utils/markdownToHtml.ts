import { userResult } from '../store/user';
import MarkdownIt from 'markdown-it';
import jwtDecode from 'jwt-decode';
import store from '../store';
const md = new MarkdownIt();

// 将markdown转换成html语法
export function MarkdownToHtml(markdown:string){
  return md.render(markdown);
}

// 将返回的markdown语法做处理
export function MarkdownAddLine(data:{
  article: string
  time: string
}[]):string{
  const user:{userMessage:{name:string}[]} = jwtDecode(store.getState().user.userMsg.tokens)
  const name = user.userMessage[0].name;
  
  let str = `<div class="name">${name}的日记</div>`;
  for(let i=0;i<data.length;i++){
    str += `<div>${data[i].time}<div>${MarkdownToHtml(data[i].article)}`;
  }
  return str;
}