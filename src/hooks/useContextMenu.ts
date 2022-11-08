import { useEffect, useRef } from 'react';
import {defaultFiles} from '../utils/defaultFiles';
const remote = window.require('@electron/remote');
const {Menu, MenuItem} = remote;

type itemArr = {
  label: string,
  click: () => void
}[]


//传入菜单列表和绑定的元素
export const useContextMenu = (itemArr:itemArr, targetSelector: string, deeps: defaultFiles) => {
  let clickedElement = useRef<EventTarget | null>(null);

  useEffect(() => {
    //获取Menu实例
    const menu = new Menu();

    //循环遍历，想Menu实例上添加菜单
    itemArr.forEach(item => {
      menu.append(new MenuItem(item));
    });

    const handleContextMenu = (e:MouseEvent) => {
      //当点击被targetSelector包裹的时候才触发
      //@ts-ignore
      if(document.querySelector(targetSelector)?.contains(e.target)){
        clickedElement.current = e.target;
        menu.popup({window: remote.getCurrentWindow()})
      }

    }

    //window上监听事件
    window.addEventListener('contextmenu', handleContextMenu);

    //卸载时取消监听
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [deeps])

  return clickedElement;
}