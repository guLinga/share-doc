import {useState} from 'react';
import './App.css';
import {v4 as uuidv4} from 'uuid';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { fileHelper } from './utils/fileHelper';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import defaultFiles, {defaultFiles as defaultFilesType} from './utils/defaultFiles';
import MarkdownIt from 'markdown-it';
import TabList from './components/TabList';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

// const Store = window.require('electron-store');
// const fileStore = new Store({'name': 'FilesData'});

const saveFilesToStore = (files:defaultFilesType) => {
  //将信息存储到electron-store中
  // fileStore.set('files', files);
  localStorage.setItem('files',JSON.stringify(files));
}

interface editor{
  html: string
  text: string
}

function App() {
  //左侧列表
  const [files, setFiles] = useState<defaultFilesType>(JSON.parse(localStorage.getItem('files')||'null'));

  //被激活的文件id
  const [activeFileId, setActiveFileId] = useState('');

  //打开的文件id列表
  const [openedFileIds, setOpenedFileIds] = useState<string[]>([]);

  //没有保存的文件列表
  const [unsavedFileIds, setUnsavedFileIds] = useState<string[]>([]);

  //搜索的列表
  const [searchedFiles, setSearchedFiles] = useState<defaultFilesType>([]);
  

  //创建文件的回调
  const clickCreateFile = () => {
    const newId = uuidv4();
    const createFile = {
      id: newId,
      title: '',
      body: '',
      isNew: true
    }
    let newFiles:defaultFilesType = [];
    if(files){
      newFiles = [
        ...files,
        createFile
      ]
    }else{
      newFiles = [
        createFile
      ]
    }
    setFiles(newFiles);
    // saveFilesToStore(newFiles);
  }

  //点击激活文件，并将文件id添加到打开文件的id列表
  const fileClick = (fileId:string) => {
    //激活文件
    setActiveFileId(fileId);
    //将文件添加到打开文件的列表id
    if(!openedFileIds.includes(fileId))
    setOpenedFileIds([...openedFileIds,fileId]);
  }
  
  //打开的文件列表
  const openedFiles = openedFileIds.map(openId => {
    return files?.find(file => file.id === openId);
  })

  //当前打开的文件的内容
  const activeFile = files?.find(file => file.id === activeFileId);
  //如果是存在搜索，则显示搜索的内容
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files;

  //编辑器回调
  function handleEditorChange({ text }:editor) {
    //更新输入框里面的内容
    const newFiles = files?.map(file => {
      if(file.id === activeFileId){
        file.body = text;
      }
      return file;
    })
    setFiles(newFiles);
    //更新未保存列表
    if(!unsavedFileIds.includes(activeFileId)){
      setUnsavedFileIds([...unsavedFileIds, activeFileId]);
    }
  }

  //点击顶部的卡片显示不同的文件的回调
  function tabClick(fileId:string){
    setActiveFileId(fileId);
  }

  //关闭顶部打开文件的回调
  function tabClose(id:string){
    const tabWithout = openedFileIds.filter(fileId => fileId !== id);
    setOpenedFileIds(tabWithout);
    //关闭窗口后，如果
    if(id === activeFileId){
      if(tabWithout.length > 0){
        setActiveFileId(tabWithout[0]);
      }else{
        setActiveFileId('');
      }
    }
  }

  //删除文件
  const deleteFile = (id:string) => {
    let news: boolean = false;
    const newFiles = files.filter(file => {
      if(id === file.id && !file.isNew){
        news = true;
        fileHelper.deleteFile(file.title);
      }
      return file.id !== id
    });
    setFiles(newFiles);
    if(!news){
      saveFilesToStore(newFiles);
      //如果删除文件打开，则关闭
      tabClose(id);
    }
  }

  //修改文件名称
  const updateFileName = (id:string, value:string, isNew: boolean) => {
    const newFiles = files.map(file => {
      if(file.id === id){
        //储存文件
        if(isNew){
          //新建文件
          fileHelper.writeFile(`${value}`,(file.body || ''));
        }else{
          //修改文件名
          fileHelper.renameFile(`${file.title}`, `${value}`);
        }
        file.title = value;
        //如果是新文件，讲isNew变成false`
        file.isNew = false;
      }
      return file;
    })
    saveFilesToStore(newFiles);
    setFiles(newFiles);
  }

  //搜索文件
  const filesSearch = (keyWord:string) => {
    const newFiles = files?.filter(file => file.title.includes(keyWord));
    setSearchedFiles(newFiles);
  }

  //保存文件
  const clickSaveFile = () => {
    fileHelper.writeFile(`${activeFile?.title}`, activeFile?.body || '').then(() => {
      //删除未保存的Id
      setUnsavedFileIds(unsavedFileIds.filter(id => id !== activeFile?.id));
    })
  }

  return (
    <div className="App container-fluid">
      <div className='row'>
        <div className='col-3 left-panel px-0 left-panel'>
          <FileSearch title="搜索我的文档" onFileSearch={(value)=>{filesSearch(value)}} closeSearchCallBack={()=>{setSearchedFiles([])}} />
          <FileList
            files={fileListArr}
            onFileClick={(id)=>{fileClick(id)}}
            onSaveEdit={(id, value, isNew)=>{updateFileName(id,value, isNew)}}
            onFileDelete={(id)=>{deleteFile(id)}}
          />
          <div className='row g-0 button-group'>
            <div className="col">
              <BottomBtn text="新建" colorClass="btn-primary no-border-redius" icon={faPlus} callback={clickCreateFile}/>
            </div>
            <div className="col">
              <BottomBtn text="导入" colorClass="btn-success no-border-redius" icon={faFileImport} callback={()=>{}}/>
            </div>
          </div>
        </div>
        <div className='col-9 right-panel px-0'>
          {
            !activeFile &&
            <div className='start-page'>
              选择或创建新的markdown文档
            </div>
          }
          {
            activeFile &&
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileId}
                unsaveIds={unsavedFileIds}
                onCloseTab={(id)=>{
                  tabClose(id);
                }}
                onTabClick={(id)=>{
                  tabClick(id);
                }}
              />
              <MdEditor
                key={activeFile && activeFile.id}
                value={activeFile?.body}
                className="editor"
                renderHTML={text => mdParser.render(text)}
                onChange={(e)=>{handleEditorChange(e)}}
              />
              <div className="col">
                <BottomBtn text="保存" colorClass="btn-primary no-border-redius" icon={faPlus} callback={clickSaveFile}/>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
