import { dir } from "./useResultDirectory";
import { useEffect, useState } from 'react';
import {defaultFiles as defaultFilesType} from '../utils/defaultFiles';
import { fileListNameType } from '../pages/filesManager';
const {extname, basename} = window.require('path');
var watch = window.require('watch')

//监听文档下面的yun文件的变化，只监听第一层，不监听yun目录里面目录的内容。
export const useWatchDirectroy = (callback:(tag:string,msg:{
  curr: string,
  prev?: string
})=>void,fileListName:defaultFilesType, files: defaultFilesType) => {
  
  useEffect(()=>{

    console.log('值改变了');
    

    let temp:any = null;
    watch.createMonitor(dir, function (monitor:any) {

      temp = monitor;

      //监听新增
      monitor.on("created", function (f:string) {
        const base = basename(f);
        if(dir+"\\"+base === f){
          const suffix = extname(base);
          if(suffix==='.md'){
            const curr = basename(f, extname(f));
            callback('新增', {curr});
          }
        }
      })

      //监听删除
        monitor.on("removed", function (f:string) {
          const base = basename(f);
          if(dir+"\\"+base === f){
            const suffix = extname(base);
            if(suffix==='.md'){
              const curr = basename(f, extname(f));
              callback('删除',{curr});
            }
          }
        })

    })

    //卸载monitor，不然会产生好多个monitor
    return () => {
      if(temp)temp.stop()
    }

    //这里监听files和fileListName，不然，无法获取到最新的值
  },[fileListName, files])
}