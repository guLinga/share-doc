import { defaultFiles } from "./defaultFiles";
interface map{
  [key:string]:{}
}

/**
 * 将数组转换成对象的形式
 * 对象的key值是对应的数值元素的id的value值
 * 对象的value值是对应的数组元素
 * 
 */
export const flattenArr = (arr:defaultFiles):Object => {
  // return arr.reduce((map:map,item) => {
  //   map[item.id] = item;
  //   return map;
  // }, {})
  return {}
}

/**
 * 提升DOM
 * 当点击一个DOM的时候，可能点击的是子元素，这时候需要提升DOM当想要得到的DOM
 */
export const getParentNode = (node:EventTarget | null , parentClassName:string):HTMLElement | undefined => {
  let current = node;

  while(current!==null){

    //@ts-ignore
    if(current.classList.contains(parentClassName)){
      //@ts-ignore
      return current;
    }

    //@ts-ignore
    current = current.parentNode;
  }
}