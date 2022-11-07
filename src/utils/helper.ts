import { defaultFiles } from "./defaultFiles";


export const flattenArr = (arr:defaultFiles):Object => {
  return arr.reduce((map,item) => {
    // map[item.id] = item;
    return map;
  }, {})
}