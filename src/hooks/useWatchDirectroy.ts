import { dir } from "./useResultDirectory";
import { useEffect } from 'react';
const {extname, basename} = window.require('path');
var watch = window.require('watch')
export const useWatchDirectroy = (callback:(tag:string,msg:{
  curr: string,
  prev?: string
})=>void) => {
  useEffect(()=>{
    watch.createMonitor(dir, function (monitor:any) {
      //监听新增
      monitor.on("created", function (f:any) {
        const suffix = extname(basename(f));
        if(suffix==='.md'){
          const curr = basename(f, extname(f));
          callback('新增', {curr});
        }
      })
      //监听修改
      monitor.on("changed", function (f:any, curr:any, prev:any) {
        const suffix = extname(basename(f));
        if(suffix==='.md'){
          callback('修改',{curr,prev});
        }
      })
      //监听删除
      monitor.on("removed", function (f:any) {
        const suffix = extname(basename(f));
        if(suffix==='.md'){
          const curr = basename(f, extname(f));
          callback('删除',{curr});
        }
      })
    })
  },[])
}