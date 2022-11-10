import {useState} from 'react';
import './App.css';
import {v4 as uuidv4} from 'uuid';
import { faPlus, faFileImport, faBandage } from '@fortawesome/free-solid-svg-icons';
import { fileHelper } from './utils/fileHelper';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import LeftSelector from './components/LeftSelector';
import defaultFiles,{defaultFiles as defaultFilesType} from './utils/defaultFiles';
import { Resizable } from 're-resizable';
import MarkdownIt from 'markdown-it';
import TabList from './components/TabList';
import MdEditor from 'react-markdown-editor-lite-plus';
import 'react-markdown-editor-lite-plus/lib/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const remote = window.require('@electron/remote');

const {basename, extname, parse} = window.require('path');

const save = remote.app.getPath('documents');

// electron-store储存
// const Store = window.require('electron-store');
// const fileStore = new Store({'name': 'FilesData'});

const saveFilesToStore = (files:defaultFilesType) => {
  //将信息中的body去除掉，添加到localStorage中
  const newFiles = Object.keys(files).reduce((result:defaultFilesType, file) => {
    const {id, path, title } = files[file];
    const temp = {
      id,
      path,
      title
    }
    result[file] = temp;
    return result;
  },{})
  
  localStorage.setItem('files',JSON.stringify(newFiles));
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
  const [searchedFiles, setSearchedFiles] = useState<defaultFilesType>({});

  //左侧列表是否打开
  const [leftListOpen, setLeftListOpen] = useState(true);

  //新建文件的id，或修改文件的id
  const [isNewFile, setIsNewFile] = useState('');

  //新建文件的回调
  const clickCreateFile = () => {
    if(isNewFile!==''){
      //提示
      remote.dialog.showMessageBox({
        type: 'info',
        title: `错误`,
        message: `你有正在命名的文件`,
      })
    }else{
      const newId = uuidv4();
      const createFile = {
        id: newId,
        title: '',
        body: '',
        isNew: true
      }
      //处理没有文件的特殊情况
      let filesTemp = files ?? {};
      let newFiles:defaultFilesType = {
        ...filesTemp,
        [newId]: createFile
      };
      //从新设置新文件和文件列表
      setIsNewFile(newId);
      setFiles(newFiles);
    }
  }

  //点击激活文件，并将文件id添加到打开文件的id列表
  const fileClick = async (fileId:string) => {
    //激活文件
    if(fileId!==isNewFile)
    setActiveFileId(fileId);
    //读取文件
    if(files[fileId]&&!files[fileId].isLoaded&&!files[fileId].isNew){
      fileHelper.readFile(files[fileId].path).then((data:any) => {
        files[fileId].body = data;
        files[fileId].isLoaded = true;
        setFiles({...files});
      })
    }
    
    //将文件添加到打开文件的列表id
    if(!openedFileIds.includes(fileId))
    setOpenedFileIds([...openedFileIds,fileId]);
  }
  
  //打开的文件列表
  const openedFiles = openedFileIds.reduce((result:defaultFilesType,item)=>{
    if(files[item]){
      result[item] = files[item];
    }
    return result;
  },{})

  //当前打开的文件的内容
  const activeFile = files ? files[activeFileId] : undefined;
  //如果是存在搜索，则显示搜索的内容
  const fileListArr = (Object.keys(searchedFiles).length > 0) ? searchedFiles : files;

  //编辑器回调
  function handleEditorChange({ text }:editor) {
    //更新输入框里面的内容
    files[activeFileId].body = text;
    setFiles({...files});
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
    if(files[id]&&!files[id].isNew){
      news = true;
      if(files[id].path!==undefined)fileHelper.deleteFile(files[id].path||'');
      delete files[id];
      setFiles({...files});
    }
    if(news){
      saveFilesToStore({...files});
      //如果删除文件打开，则关闭
      tabClose(id);
    }
  }

  //修改文件名称
  const updateFileName = (id:string, value:string, isNew: boolean) => {
    if(files[id]){
      //储存文件
      const file = files[id];
      if(isNew){
        //给对象添加path
        file.path = `${save}\\yun\\${value}.md`
        //在电脑的文档下新建文件
        fileHelper.writeFile(file.path,(''));
      }else{
        //修改文件名
        fileHelper.renameFile(file.path || `${save}\\yun\\${file.title}.md`, `${parse(file.path).dir}\\${value}.md` || `${save}\\yun\\${value}.md`);
        file.path = `${parse(file.path).dir}\\${value}.md` || `${save}\\yun\\${value}.md`
      }
      file.title = value;
      //如果是新文件，讲isNew变成false
      file.isNew = false;
    }
    saveFilesToStore({...files});
    setFiles({...files});
  }

  //搜索文件，展示删除搜索文件
  const filesSearch = (keyWord:string) => {
    let result:defaultFilesType = {};
    // const newFiles = files?.filter(file => file.title.includes(keyWord));
    Object.keys(files).map(id=>{
      if(files[id].title.includes(keyWord)){
        result[id] = files[id];
      }
    })
    setSearchedFiles(result);
  }

  //保存文件
  const clickSaveFile = () => {
    if(activeFileId){
      fileHelper.writeFile(activeFile?.path, activeFile?.body || '').then(() => {
        //删除未保存的Id
        setUnsavedFileIds(unsavedFileIds.filter(id => id !== activeFile?.id));
      })
    }
  }

  //导入文件，展示删除导入文件
  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '请选择导入的markdown文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Markdown files', extensions: ['md']}
      ]
    }).then((result:any) => {
      // console.log('result',result, result.canceled, result.filePaths);
      const {canceled, filePaths}:{canceled:boolean,filePaths:string[]} = result;
      if(!canceled){
        const msg = {
          is: false,
          len: 0
        }
        //获取导入的文件
        const fileteredPaths = filePaths.filter(path => {
          //去除掉已经存在的文件
          let alreadyAdded = null;
          if(files!==undefined && files!==null && Object.keys(files).length!==0){
            alreadyAdded = Object.values(files).find(file => {
              // 记录有多少个文件已经存在，不必重新导入
              if(file.path === path){
                msg.is = true;
                msg.len++;
              }
              return file.path === path;
            })
          }
          return !alreadyAdded;
        })
        
        //将数组转换成对象
        let result:defaultFilesType = {};
        fileteredPaths.map(path => {
          const id = uuidv4();
          result[id] = {
            id: id,
            title: basename(path, extname(path)),
            path
          }
        })

        //更新文件列表
        const isFiles = files ?? [];
        const newFiles = {...isFiles, ...result};
        setFiles(newFiles);
        saveFilesToStore(newFiles);

        //提示
        remote.dialog.showMessageBox({
          type: 'info',
          title: `导入文件`,
          message: `共导入了${filePaths.length}个文件，成功导入了${filePaths.length - msg.len}个文件，有${msg.len}个文件已经存在。`,
        })
      }
    }).catch((err:any) => {
      console.log('err',err);
    })
  }

  return (
    <div className="App container-fluid">
      <div className='row view-flex'>
        <LeftSelector setLeftListOpen={()=>{
          setLeftListOpen(!leftListOpen)
        }} />
        <Resizable
          defaultSize={{
            width: 320,
            height: '',
          }}
          style={{height: '100vh', overflow: 'hidden', backgroundColor: 'white', padding: "0", borderRight: '1px solid #e6effc'}}
          minWidth="260"
          maxHeight="100%"
          maxWidth="60%"
          minHeight="100%"
          className={!leftListOpen?'openListClassName':''}
        >
          <div className='view-middle-panel px-0'>
            {/* <FileSearch title="搜索我的文档" onFileSearch={(value)=>{filesSearch(value)}} closeSearchCallBack={()=>{setSearchedFiles([])}} /> */}
            <FileList
              files={fileListArr}
              onFileClick={(id)=>{fileClick(id)}}
              onSaveEdit={(id, value, isNew)=>{updateFileName(id,value, isNew)}}
              onFileDelete={(id)=>{deleteFile(id)}}
              isNewFile={isNewFile}
              setIsNewFile={(id)=>{
                setIsNewFile(id);
              }}
            />
            <div className='row g-0 button-group'>
              <div className="col">
                <BottomBtn text="" title="新建" colorClass="btn-primary no-border-redius" icon={faPlus} callback={clickCreateFile}/>
              </div>
              {/* <div className="col">
                <BottomBtn text="" title="导入" colorClass="btn-success no-border-redius" icon={faFileImport} callback={importFiles}/>
              </div> */}
              <div className="col">
                  <BottomBtn text="" title='保存文件' colorClass="btn-warning no-border-redius" icon={faBandage} callback={clickSaveFile}/>
                </div>
            </div>
          </div>
        </Resizable>
        <div className='view-right-panel px-0 right-vessels'>
          {
            !activeFile &&
            <div className='start-page'>
              欢迎
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
                view={{ menu: false, md: true, html: false }}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
