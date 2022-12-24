import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite-plus';
import { editor, props } from './type';
import { useState, useEffect } from 'react';
import './index.scss'
import IconFont from '../../Icon/index';
import axios from '../../../utils/axios';
import { getNowTimeStr } from '../../../utils/date';
import { message } from 'antd';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function ContentDiary({content,date,setDateList,dateList}:props) {

  //value
  const [value,setValue]= useState('');

  // 初始化value
  useEffect(()=>{
    setValue(content);
  },[content])

  //编辑器回调
  function handleEditorChange({ text }:editor) {
    setValue(text);
  }

  // 保存文章
  async function saveArticle(){
    let result = await axios({
      method: 'POST',
      url: '/diary/article',
      data: {
        article: value,
        time: date ? date : getNowTimeStr()
      }
    })
    if(result.data.code===200){
      message.success(result.data.msg);
      dateList = dateList ? dateList : [];
      setDateList([...dateList,date]);
    }
    else message.error(result.data.msg);
  }


  return (
    <div id='contentDiary'>
      <MdEditor
        value={value}
        className="editor"
        renderHTML={text => mdParser.render(text)}
        onChange={(e)=>{handleEditorChange(e)}}
        view={{ menu: true, md: true, html: false }}
        style={{height:'100%'}}
      />
      <div className='save' title='保存' onClick={saveArticle}>
        <IconFont type='icon-baocun'/>
      </div>
    </div>
  )
}
