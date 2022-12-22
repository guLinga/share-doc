import './index.scss'
import { useState, useEffect, useRef } from 'react';
import { MODELS } from './model';

function AloneTetris() {

  // 容器的格子大小
  const COL = 10, ROW = 18;

  // 定时器
  const timers = useRef<null|NodeJS.Timer>();

  // 控制自动下降
  const [auto,setAuto] = useState(true);
  
  // 创建容器
  const [container,setContainer] = useState<Array<Array<number>>>(
    Array.from(Array(18),()=>new Array(10).fill(0))
  );
    
  // 创建方块
  const [model,setModel] = useState(MODELS[Math.floor((Math.random())*MODELS.length)]);

  // 创建16宫格的位置
  const [currentX,setCurrentX] = useState(-3);
  const [currentY,setCurrentY] = useState(3);
  
  // 重新生成方块
  const [duge,setDuge] = useState(true);

  // 重新渲染
  useEffect(()=>{
    if(!isGameOver()){
      gameOver();
      return;
    }
    renderModel(0,0);
  },[duge])

  // 自动下降
  useEffect(()=>{
    renderModel(1,0);
  },[auto])

  // 最开始渲染方块
  useEffect(()=>{
    renderModel(0,0);
  },[])

  // 渲染方块
  const renderModel = (x:number,y:number) => {
    // 判断是否超出边界
    if(!checkBound(x,y))return;
    // 判断是否发生碰撞
    if(!isMeet(x,y)){
      if(x!==0)fixBottomModel();
      return;
    }
    // 将上次的渲染清空
    if(!(x===0&&y===0)){
      for (const key in model) {
        const item = model[key];
        if(container[item.row+currentX])
        container[item.row+currentX][item.col+currentY] = 0;
      }
    }
    // 渲染新的位置
    for (const key in model) {
      const item = model[key];
      if(container[item.row+currentX+x])
      container[item.row+currentX+x][item.col+currentY+y] = 1;
    }
    // 更新位置
    setCurrentX(currentX+x);
    setCurrentY(currentY+y);
    // 更新容器渲染
    setContainer([...container]);
    // 自动下降
    autoDown();
  }

  // 清除渲染
  const clearRender = () => {
    for (const key in model) {
      const item = model[key];
      if(container[item.row+currentX])
      container[item.row+currentX][item.col+currentY] = 0;
    }
    // 更新容器渲染
    setContainer([...container]);
  }

  // 旋转模型
  const rotate = () => {
    if(!rotateBound())return;
    // 清除之前的渲染
    clearRender();
    for(const key in model){
      const item = model[key];
      const temp = item.row;
      item.row = item.col;
      item.col = 3-temp;
    }
    // 更改方块数据
    setModel(model);
    // 重新渲染
    renderModel(0,0);
  }


  // 按键方向控制
  const keyDirrction = (event:KeyboardEvent) => {
    switch(event.key){
      case 'ArrowUp':
        rotate();
        break;
      case 'ArrowDown':
        renderModel(1,0);
        break;
      case 'ArrowRight':
        renderModel(0,1);
        break;
      case 'ArrowLeft':
        renderModel(0,-1);
        break;
    }
  }

  // 按键方向控制
  useEffect(()=>{
    document.addEventListener('keydown',keyDirrction);
    return ()=>{
      document.removeEventListener('keydown',keyDirrction);
    }
  },[container,currentX,currentY,model])

  // 判断是否超出容器
  const checkBound = (x:number,y:number) => {
    for (const key in model) {
      const data = model[key];
      // 检测是否超出边界
      if(data.col+y+currentY<0){
        return false;
      }
      if(data.col+y+currentY>=COL){
        return false;
      }
      if(data.row+x+currentX>=ROW){
        fixBottomModel();
        return false;
      }
    }
    return true;
  }

  // 判断旋转后是否超出
  const rotateBound = () => {
    const temparr = JSON.parse(JSON.stringify(model));
    for (const key in temparr) {
      // 块元素数据
      var blockModel = temparr[key];
      // 实现算法
      var temp = blockModel.row;
      blockModel.row = blockModel.col;
      blockModel.col = 3-temp;
    }
    for (const key in temparr) {
      var item = temparr[key];
      // 判断该位置是否已经存在块元素
      if(container[item.row+currentX]&&container[item.row+currentX][item.col+currentY]===2){
        return false;
      }else if(item.col+currentY<0||item.col+currentY>=COL){
        return false;
      }else if(item.row+currentX>=ROW){
        return false;
      }
    }
    return true;
  }

  // 判断是否碰撞
  const isMeet = (x:number,y:number) => {
    for (const key in model) {
      var item = model[key];
      // 判断该位置是否已经存在块元素
      if(container[item.row+x+currentX]&&container[item.row+x+currentX][item.col+y+currentY]===2){
        return false;
      }
    }
    return true;
  }

  // 把模型固定到底部
  const fixBottomModel = () => {
    for (const key in model) {
      const item = model[key];
      if(container[item.row+currentX])
      container[item.row+currentX][item.col+currentY] = 2;
    }
    // 改变渲染
    setContainer([...container]);
    // 重新设置16宫格的初始位置
    setCurrentX(-3);
    setCurrentY(3);
    // 重新设置方块数据
    setModel(MODELS[Math.floor((Math.random())*MODELS.length)]);
    // 判断一行是否铺满
    isRemoveLine();
    // 重新渲染
    setDuge(!duge);
  }

  // 判断一行是否铺满
  const isRemoveLine = () => {
    // 在一行中每一列都纯在块元素
    for(let i=ROW-1;i>=0;i--){
      let flag = true;
      for(let j=0;j<COL;j++){
        if(container[i][j]!==2){
          flag = false;
          break;
        }
      }
      if(flag){
        // 清除铺满的行
        removeLine(i);
        // 被清除的行上面的方块下落
        downLine(i);
      }
    }
  }

  // 清理铺满的行
  const removeLine = (line:number) => {
    for(var i=0;i<COL;i++){
      container[line][i] = 0;
    }
    setContainer([...container]);
  }

  // 被清理行上面的块元素下落
  const downLine = (line:number) => {
    for(var i=line-1;i>=0;i--){
      for(var j=0;j<COL;j++){
        if(container[i][j]===0)continue;
        container[i][j] = 0;
        container[i+1][j] = 2;
      }
    }
    setContainer([...container]);
  }

  // 方块自动下落
  const autoDown = () => {
    if(timers.current!==null)clearInterval(timers.current);
    timers.current = setInterval(()=>{
      setAuto(!auto);
    },600)
  }

  // 判断游戏结束
  const isGameOver = () => {
    // 当第0行存在块元素的时候游戏结束
    for(var i=0;i<COL;i++){
      if(container[0][i])return false;
    }
    return true;
  }

  // 游戏结束
  const gameOver = () => {
    if(timers.current)clearInterval(timers.current);
    alert('游戏结束');
  }

  return (
    <div id="aloneTetris">
      {
        container.map((item,idxItem)=>{
          return (
            item.map((ch,idxCh)=>{
              return (
                <div key={idxItem+"_"+idxCh} className={
                  ch===1?'color ch':
                  ch===2?'fixColor ch':'ch'
                }></div>
              )
            })
          )
        })
      }
    </div>
  )
}

export default AloneTetris
