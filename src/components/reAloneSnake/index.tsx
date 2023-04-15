import { useEffect, useRef, useState } from 'react'
import block from './graph';
import './index.scss'

function Tiers() {

  // 初始化地图
  const [arr,setArr] = useState<number[][]>(new Array(20).fill([]).map(()=>new Array(10).fill(0)));
  // 初始化十六宫格左上角坐标
  const [SixteenSigns,setSixteenSigns] = useState<[number,number]>([-3,4]);
  // 初始化图形坐标
  const [graph,setGraph] = useState(block[Math.floor((Math.random())*block.length)]);
  // 初始化即将到达的位置坐标
  const [arrive,setArrive] = useState<number[][]>(new Array(graph.length).fill([]).map(()=>new Array(2).fill(undefined)));
  // 定时器控制页面重新渲染
  const [control,setControl] = useState(true);
  // 判断第一次是否向下
  const [key,setKey] = useState(0);
  // 得分
  const [value, setValue] = useState(0);

  // 判断将要到达哪里
  useEffect(()=>{
    // 清除上一次渲染
    if(arrive[0][0]!==undefined){
      for(let i=0;i<arrive.length;i++){
        if(arr[arrive[i][0]][arrive[i][1]]===3)
        arr[arrive[i][0]][arrive[i][1]] = 0;
      }
    }
    let min = 30;
    for(let i=0;i<graph.length;i++){
      let temp = 0;
      let idx = graph[i][0];
      while(idx<arr.length&&arr[idx][graph[i][1]+SixteenSigns[1]]!==2){
        idx++;
        temp++;
      }
      min = Math.min(temp-1,min);
    }
    if(min>0){
      for(let i=0;i<graph.length;i++){
        arrive[i][0] = graph[i][0]+min;
        arrive[i][1] = graph[i][1]+SixteenSigns[1];
        arr[arrive[i][0]][arrive[i][1]] = 3;
      }
      setArrive([...arrive]);
      setArr([...arr]);
    }
  },[SixteenSigns,graph])
    

  // 清除本次渲染
  const clearRender = function(SixteenSigns:[number,number]){
    for(let i=0;i<graph.length;i++){
      const item = graph[i];
      if(item[0]+SixteenSigns[0]>=0)
      arr[item[0]+SixteenSigns[0]][item[1]+SixteenSigns[1]] = 0;
    }
    setArr([...arr]);
  }

  // 移动后渲染图形和反转后渲染图形
  useEffect(()=>{
    for(let i=0;i<graph.length;i++){
      const item = graph[i];
      if(item[0]+SixteenSigns[0]>=0)
      arr[item[0]+SixteenSigns[0]][item[1]+SixteenSigns[1]] = 1;
    }
    setArr([...arr]);
  },[SixteenSigns,graph])

  // 开启下一次循环
  const nextCourse = function(){
    setGraph(block[Math.floor((Math.random())*block.length)]);
    setSixteenSigns([-3,4]);
  }

  // 到最下面
  const downFix = function(){
    clearRender(SixteenSigns);
    let min = 30;
    for(let i=0;i<graph.length;i++){
      let temp = 0;
      let idx = graph[i][0];
      while(idx<arr.length&&arr[idx][graph[i][1]+SixteenSigns[1]]!==2){
        idx++;
        temp++;
      }
      min = Math.min(temp-1,min);
    }
    for(let i=0;i<graph.length;i++){
      arr[graph[i][0]+min][graph[i][1]+SixteenSigns[1]] = 2;
    }
    setArr([...arr]);
    clearTier();
    nextCourse();
  }

  // 向下移动
  const down = function(){
    if(judgeBoundary(graph,[SixteenSigns[0]+1,SixteenSigns[1]],'bottom')){
      fixed(graph,SixteenSigns);
      return;
    }
    clearRender(SixteenSigns);
    setSixteenSigns([SixteenSigns[0]+1,SixteenSigns[1]]);
  }

  // 向左移动
  const left = function(){
    if(judgeBoundary(graph,[SixteenSigns[0],SixteenSigns[1]-1],'left'))return;
    clearRender(SixteenSigns);
    setSixteenSigns([SixteenSigns[0],SixteenSigns[1]-1]);
  }

  // 向右移动
  const right = function(){
    if(judgeBoundary(graph,[SixteenSigns[0],SixteenSigns[1]+1],'right'))return;
    clearRender(SixteenSigns);
    setSixteenSigns([SixteenSigns[0],SixteenSigns[1]+1]);
  }

  // 向下移动
  const bottom = function(){
    if(judgeBoundary(graph,[SixteenSigns[0]+1,SixteenSigns[1]],'bottom'))return;
    clearRender(SixteenSigns);
    setSixteenSigns([SixteenSigns[0]+1,SixteenSigns[1]]);
  }

  // 变形
  const up = function(){
    const graphTemp = JSON.parse(JSON.stringify(graph));
    for(const key in graphTemp){
      const item = graphTemp[key];
      const temp = item[0];
      item[0] = item[1];
      item[1] = 3-temp;
    }
    if(judgeBoundary(graphTemp,SixteenSigns,'top'))return;
    clearRender(SixteenSigns);
    setGraph(graphTemp);
    
  }

  // 判断是否超出边界，判断是否有别的图形已经绘制
  const judgeBoundary = function(graph:number[][],SixteenSigns:[number,number],move:'top'|'bottom'|'left'|'right'){
    for(let i=0;i<graph.length;i++){
      const item = graph[i];
      // 判断右边界是否越界
      if(item[1]+SixteenSigns[1]>=arr[0].length){
        return true;
      }
      // 判断左边界是否越界
      if(item[1]+SixteenSigns[1]<0){
        return true;
      }
      // 左右上判断是否越界
      if(item[0]+SixteenSigns[0]>=0&&move!=='bottom'&&(arr[item[0]+SixteenSigns[0]][item[1]+SixteenSigns[1]]===2)){
        return true;
      }
      if(
        // 判断下边界是否越界
        item[0]+SixteenSigns[0]>=0&&
        // 判断下方是否存在元素
        move==='bottom'&&
        (item[0]+SixteenSigns[0]>=arr.length||arr[item[0]+SixteenSigns[0]][item[1]+SixteenSigns[1]]===2)
      ){
        nextCourse();
        return true;
      }

    }
    return false;
  }

  // 将已经固定的图形从1变成2
  const fixed = function(graph:number[][],SixteenSigns:[number,number]){
    for(let i=0;i<graph.length;i++){
      const item = graph[i];
      if(item[0]+SixteenSigns[0]<0){
        return gameOver();
      }
      arr[item[0]+SixteenSigns[0]][item[1]+SixteenSigns[1]] = 2;
    }
    setArr([...arr]);
    clearTier();
  }

  // 判断是否消除方块
  const clearTier = function(){
    let result = [];
    for(let i=arr.length-1;i>=0;i--){
      let flag = true;
      for(let j=0;j<arr[i].length;j++){
        if(arr[i][j]!==2){
          flag = false;
          break;
        }
      }
      if(flag){
        result.push(i);
      }
    }
    let idx = 0;
    setValue(value+result.length)
    for(let i=0;i<result.length;i++){
      removeLine(result[i]+idx);
      downLine(result[i]+idx);
      idx++;
    }
  }

  // 清理铺满的行
  const removeLine = (line:number) => {
    for(var i=0;i<arr[line].length;i++){
      arr[line][i] = 0;
    }
    setArr([...arr]);
  }

  // 被清理行上面的块元素下落
  const downLine = (line:number) => {
    for(var i=line-1;i>=0;i--){
      for(var j=0;j<arr[i].length;j++){
        if(arr[i][j]===0)continue;
        arr[i][j] = 0;
        arr[i+1][j] = 2;
      }
    }
    setArr([...arr]);
  }



  // 初始化定时器
  const timer = useRef<NodeJS.Timer>();
  useEffect(() =>{
		timer.current = setInterval(()=>{
      setControl((x)=>!x)
    },600)
		return () => clearInterval(timer.current)
	},[])

  useEffect(()=>{
    if(key===0){
      setKey(key+1);
    }else{
      console.log('DOWN');
      
      down();
    }
  },[control])

  // 初始化方向事件
  useEffect(()=>{
    const keyEvent = function({code}:KeyboardEvent){
      if(code==='ArrowLeft'){
        left();
      }
      if(code==='ArrowRight'){
        right();
      }
      if(code==='ArrowUp'){
        up();
      }
      if(code==='ArrowDown'){
        bottom();
      }
      if(code==='Enter'){
        downFix();
      }
    }
    document.addEventListener('keydown',keyEvent);
    return ()=>{
      document.removeEventListener('keydown',keyEvent);
    }
  },[SixteenSigns,arr,graph,control])

  // 判断游戏是否结束
  const gameOver = function(){
    alert('游戏结束');
  }

  function childClassName(child:number){
    if(child===0)return 'col';
    else if(child===1)return 'col remove';
    else if(child===2)return 'col fixed';
    else if(child===3)return 'col arrive';
  }
  
  return (
    <>
      {value}
      {
        arr.map((item,row)=>{
          return <div className='row' key={row}>
            {
              item.map((child,col)=>{
                return <div className={childClassName(child)} key={`${row},${col}`}></div>
              })
            }
          </div>
        })
      }
    </>
  )
}

export default Tiers