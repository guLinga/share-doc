import { dir } from "./useResultDirectory"
import { useEffect } from 'react';
const fs = window.require('fs');
export const useExists = () => {
  useEffect(()=>{
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir,(data:any)=>{
        console.log(data);
      })
    }
  },[])
}