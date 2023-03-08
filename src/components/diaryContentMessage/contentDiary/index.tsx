import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite-plus';
import { editor, props } from './type';
import { useState, useEffect, useRef } from 'react';
import './index.scss'
import IconFont from '../../Icon/index';
import axios from '../../../utils/axios';
import { getNowTimeStr } from '../../../utils/date';
import { message } from 'antd';
import useDebounce from '../../../utils/debounce';
import {MarkdownAddLine} from '../../../utils/markdownToHtml';
import { downPdf } from '../../../utils/downPdf';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function ContentDiary({content,date,setDateList,dateList}:props) {

  //value
  const [value,setValue]= useState('');
  // 弹窗
  const [pop, setPop] = useState(false);
  // html模板
  const [template,setTemplate] = useState("");
  // 
  const ref = useRef(null);

  // 初始化value
  useEffect(()=>{
    setValue(content);
  },[content])

  //编辑器回调
  function handleEditorChange({ text }:editor) {
    setValue(text);
    debounceSaveArticle();
  }



  const debounceSaveArticle = useDebounce(saveArticle)

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

  // 导出日记

  // 获取全部日记
  async function allDiary() {
    let result = await axios({
      url: '/diary/allDiary'
    })
    console.log(result);
    if(result.data.data.length==0){
      message.error('没有日记内容')
    }else{
      setTemplate(MarkdownAddLine(result.data.data));
    }
  }

  // 下载日记
  function down(){
    // @ts-ignore
    downPdf(document.querySelector('.popContext'))
  }

  return (
    <div id='contentDiary'>
      {
        pop && <div className='shadow'>
          <div ref={ref} className='pop'>
            <div className='popContext' dangerouslySetInnerHTML={{__html:template}}></div>
          </div>
          <button onClick={down}>点击下载</button>
        </div>
      }
      <MdEditor
        value={value}
        className="editor"
        renderHTML={text => mdParser.render(text)}
        onChange={(e)=>{handleEditorChange(e)}}
        view={{ menu: true, md: true, html: false }}
        style={{height:'100%'}}
      />
      <div className='save' title='保存' onClick={()=>{
        setPop(!pop);
        allDiary()
      }}>
        <IconFont type='icon-baocun'/>
      </div>
    </div>
  )
}
