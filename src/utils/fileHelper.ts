const fs = window.require('fs').promises;
const paths = window.require('path');

export const fileHelper = {
  //读取
  readFile: (path:string | undefined) => {
    return fs.readFile(paths.join(path), {encoding: 'utf8'})
  },

  //写入
  writeFile: (path:string | undefined, content:string) => {
    return fs.writeFile(paths.join(path), content, {econding: 'utf8'})
  },

  //改名
  renameFile: (path:string, newPath:string) => {
    return fs.rename(paths.join(path), paths.join(newPath));
  },

  //删除
  deleteFile: (path: string) => {
    return fs.unlink(paths.join(path));
  }
}

