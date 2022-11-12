import { fileHelper } from "../utils/fileHelper"
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {defaultFiles as defaultFilesType} from '../utils/defaultFiles';
const {extname} = window.require('path');
const fs = window.require('fs');
const path = window.require('path');
const remote = window.require('@electron/remote');
const save = remote.app.getPath('documents');
export const dir = path.join(save, '.yun'); 

interface fileNameType {
  files: defaultFilesType
  fileListName: defaultFilesType
}

//读取文档中的.yun文件，目前只读取第一层
export const useResultDirectory = async (callback:(result:fileNameType)=>void) => {
   useEffect(()=>{
    (async function fn(){
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
      let result = directory.reduce((result:fileNameType,item)=>{
        //只读取md文件，判断是否是md文件
        if(extname(item)!=='.md')return result;
        const id = uuidv4();
        const title = item.split('.md')[0];
        result.files[id] = {
          id,
          title: title,
          path: dir + "\\" + item
        }
        result.fileListName[title] = {
          id,
          title: title,
          path: dir + "\\" + item
        }
        return result;
      },{files:{},fileListName:{}})
      callback(result);
    })()
  },[])
}