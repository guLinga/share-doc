import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite-plus';
import { editor, props } from './type';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function ContentDiary({content}:props) {

  //编辑器回调
  function handleEditorChange({ text,html }:editor) {
    console.log(text,html);
  }

  return (
    <div>
      <MdEditor
        value={content}
        className="editor"
        renderHTML={text => mdParser.render(text)}
        onChange={(e)=>{handleEditorChange(e)}}
        view={{ menu: true, md: true, html: false }}
      />
    </div>
  )
}
