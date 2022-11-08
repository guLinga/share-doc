const fs = window.require('fs').promises;
const paths = window.require('path');
const remote = window.require('@electron/remote');
const save = remote.app.getPath('documents')



export const fileHelper = {
  readFile: (path:string | undefined) => {
    return fs.readFile(paths.join(path), {encoding: 'utf8'})
  },
  writeFile: (path:string | undefined, content:string) => {
    return fs.writeFile(paths.join(path), content, {econding: 'utf8'})
  },
  renameFile: (path:string, newPath:string) => {
    return fs.rename(paths.join(path), paths.join(newPath));
  },
  deleteFile: (path: string) => {
    return fs.unlink(paths.join(save, `${path}.md`));
  }
}

