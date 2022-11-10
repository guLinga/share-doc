import { fileHelper } from "./fileHelper"
import { v4 as uuidv4 } from 'uuid';
import {defaultFiles as defaultFilesType} from './defaultFiles';
const fs = window.require('fs');
const path = window.require('path');
const remote = window.require('@electron/remote');
const save = remote.app.getPath('documents');
const dir = path.join(save, 'yun'); 

export const resultDirectory = async function result() {
  if(window.name == ""){ //为空就是新的
    window.name = 'isReload';
    console.log('first in page');
  }else if(window.name == 'isReload'){ //有预设值就是刷新的
    console.log('page refresh....');
    return;
  }
  //查询到的目录中的全部文件名称
  let directory:string[] = await fileHelper.readFiles();
  directory.sort(function(a:string, b:string) {
    return fs.statSync(dir + "\\" +  a).mtime.getTime() - 
           fs.statSync(dir + "\\" + b).mtime.getTime();
  });
  let result = directory.reduce((result:defaultFilesType,item)=>{
    const id = uuidv4();
    result[id] = {
      id,
      title: item,
      path: dir + "\\" + item
    }
    return result;
  },{})
  localStorage.setItem('files', JSON.stringify(result));
}