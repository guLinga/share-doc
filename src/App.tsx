import { useState } from 'react';
import { useExists } from './hooks/useExists';
import { useWatchDirectroy } from './hooks/useWatchDirectroy';
import { dir, useResultDirectory } from './hooks/useResultDirectory';
import { fileHelper } from './utils/fileHelper';
import {v4 as uuidv4} from 'uuid';
import { Resizable } from 're-resizable';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite-plus';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import LeftSelector from './components/LeftSelector';
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import {defaultFiles as defaultFilesType} from './utils/defaultFiles';
import { faPlus, faFileImport, faBandage } from '@fortawesome/free-solid-svg-icons';
import 'react-markdown-editor-lite-plus/lib/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './app.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const remote = window.require('@electron/remote');

const {basename, extname, parse} = window.require('path');

//documents地址
const save = remote.app.getPath('documents');

//将信息去掉body后储存到localStorage中，将文件名也储存到localStorage中
const saveFilesToStore = (files:defaultFilesType, filesName: defaultFilesType) => {
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
  localStorage.setItem('filesName', JSON.stringify(filesName));
}

interface editor{
  html: string
  text: string
}

export interface fileListNameType{
  [key:string]: boolean
}

function App() {

  //查询是否有该目录，没有则创建
  useExists();

  //左侧列表
  const [files, setFiles] = useState<defaultFilesType>(JSON.parse(localStorage.getItem('files')||'{}'));
  
  //左侧列表文件名称的储存
  const [fileListName, setFileListName] = useState<defaultFilesType>(JSON.parse(localStorage.getItem('filesName')||"{}"));

  //被激活的文件id
  const [activeFileId, setActiveFileId] = useState('');
  
  //打开的文件id列表
  const [openedFileIds, setOpenedFileIds] = useState<string[]>([]);

  //没有保存的文件列表
  const [unsavedFileIds, setUnsavedFileIds] = useState<string[]>([]);

  //储存当前新建或修改文件的原名称
  const [originName, setOriginName] = useState<string>('');

  //搜索的列表
  const [searchedFiles, setSearchedFiles] = useState<defaultFilesType>({});

  //左侧列表是否打开
  const [leftListOpen, setLeftListOpen] = useState(true);

  //新建文件的id，或修改文件的id
  const [isNewFile, setIsNewFile] = useState('');

  //监听文件
  useWatchDirectroy((tag,msg)=>{
    const {curr} = msg;
    switch(tag){
      case '新增':
        //如果存在说明是通过软件新增的，不需要新增
        console.log('新增');
        if(fileListName[curr])return;
        const id = uuidv4();
        const temp = {
          id,
          title: curr,
          path: dir + "\\" + curr + '.md'
        }
        //修改文件列表
        files[id] = temp;
        setFiles({...files});
        //修改文件名列表
        fileListName[curr] = temp;
        setFileListName({...fileListName});
        //储存
        saveFilesToStore(files, fileListName);
        break;
      case '删除':
        //如果已经消失了说明是通过软件删除的，不用再次删除
        if(!fileListName[curr])return;
        console.log('删除', fileListName[curr]);
        //删除文件
        delete files[fileListName[curr].id];
        setFiles({...files});
        //删除文件名列表
        delete fileListName[curr];
        setFileListName({...fileListName});
        //储存本地
        saveFilesToStore(files, fileListName);
        break;
      default:
        return;
    }
  },fileListName, files);

  //获取目录列表
  useResultDirectory((result)=>{
    console.log('result',result);
    
    //赋值文件列表
    setFiles(result.files);
    // localStorage.setItem('files', JSON.stringify(result));
    //赋值文件名称列表
    setFileListName(result.fileListName);
    //本地储存
    saveFilesToStore(files, fileListName);
    // localStorage.setItem('filesName', JSON.stringify(fileListName));
  })

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

      //创建新文件的对象中的参数
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

      //设置新创建的文件的名称
      setOriginName('');

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
      //删除文件
      if(files[id].path!==undefined)fileHelper.deleteFile(files[id].path||'');
      //删除文件名列表
      delete fileListName[files[id].title];
      setFileListName({...fileListName});
    }

    //删除文件列表
    delete files[id];
    setFiles({...files});

    //如果是新文件点击了退出或关闭，则清空命名文件的id
    setIsNewFile('');

    if(news){
      saveFilesToStore({...files}, fileListName);
      //如果删除文件打开，则关闭
      tabClose(id);
    }

  }

  //修改文件名称，和新增文件
  const updateFileName = (id:string, value:string, isNew: boolean) => {
    if(files[id]){
      //储存文件
      const file = files[id];
      if(isNew){
        //给对象添加path
        file.path = `${save}\\.yun\\${value}.md`
        //在电脑的文档下新建文件
        fileHelper.writeFile(file.path,(''));
        //更新文件名列表
        fileListName[value] = file;
        setFileListName({...fileListName});
        setIsNewFile('');
      }else{
        //修改文件名
        fileHelper.renameFile(file.path || `${save}\\.yun\\${file.title}.md`, `${parse(file.path).dir}\\${value}.md` || `${save}\\.yun\\${value}.md`);
        file.path = `${parse(file.path).dir}\\${value}.md` || `${save}\\.yun\\${value}.md`
        //修改文件名列表
        delete fileListName[file.title];
        fileListName[value] = file;
        setFileListName({...fileListName});
      }
      file.title = value;
      //如果是新文件，将isNew变成false
      file.isNew = false;
    }
    //保存文件到localStorage
    saveFilesToStore({...files}, fileListName);
    //更新文件列表
    setFiles({...files});
  }

  //搜索文件，展示删除搜索文件
  const filesSearch = (keyWord:string) => {
    // let result:defaultFilesType = {};
    // // const newFiles = files?.filter(file => file.title.includes(keyWord));
    // Object.keys(files).map(id=>{
    //   if(files[id].title.includes(keyWord)){
    //     result[id] = files[id];
    //   }
    // })
    // setSearchedFiles(result);
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
    // remote.dialog.showOpenDialog({
    //   title: '请选择导入的markdown文件',
    //   properties: ['openFile', 'multiSelections'],
    //   filters: [
    //     {name: 'Markdown files', extensions: ['md']}
    //   ]
    // }).then((result:any) => {
    //   // console.log('result',result, result.canceled, result.filePaths);
    //   const {canceled, filePaths}:{canceled:boolean,filePaths:string[]} = result;
    //   if(!canceled){
    //     const msg = {
    //       is: false,
    //       len: 0
    //     }
    //     //获取导入的文件
    //     const fileteredPaths = filePaths.filter(path => {
    //       //去除掉已经存在的文件
    //       let alreadyAdded = null;
    //       if(files!==undefined && files!==null && Object.keys(files).length!==0){
    //         alreadyAdded = Object.values(files).find(file => {
    //           // 记录有多少个文件已经存在，不必重新导入
    //           if(file.path === path){
    //             msg.is = true;
    //             msg.len++;
    //           }
    //           return file.path === path;
    //         })
    //       }
    //       return !alreadyAdded;
    //     })
        
    //     //将数组转换成对象
    //     let result:defaultFilesType = {};
    //     fileteredPaths.map(path => {
    //       const id = uuidv4();
    //       result[id] = {
    //         id: id,
    //         title: basename(path, extname(path)),
    //         path
    //       }
    //     })

    //     //更新文件列表
    //     const isFiles = files ?? [];
    //     const newFiles = {...isFiles, ...result};
    //     setFiles(newFiles);
    //     saveFilesToStore(newFiles, fileListName);

    //     //提示
    //     remote.dialog.showMessageBox({
    //       type: 'info',
    //       title: `导入文件`,
    //       message: `共导入了${filePaths.length}个文件，成功导入了${filePaths.length - msg.len}个文件，有${msg.len}个文件已经存在。`,
    //     })
    //   }
    // }).catch((err:any) => {
    //   console.log('err',err);
    // })
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
          style={{height: '100vh', overflow: 'hidden', backgroundColor: 'white', padding: "0", borderRight: '2px solid #e5e5ee'}}
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
              isNewFile={isNewFile}
              fileListName={fileListName}
              originName={originName}
              setOriginName={(value)=>{
                setOriginName(value);
              }}
              onFileClick={(id)=>{fileClick(id)}}
              onSaveEdit={(id, value, isNew)=>{updateFileName(id,value, isNew)}}
              onFileDelete={(id)=>{deleteFile(id)}}
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
                view={{ menu: true, md: true, html: false }}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
