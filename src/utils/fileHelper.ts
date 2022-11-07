const fs = window.require('fs').promises;
const paths = window.require('path');
const remote = window.require('@electron/remote');
const save = remote.app.getPath('documents')


export const fileHelper = {
  readFile: (path:string) => {
    return fs.readFile(paths.join(save, `${path}.md`), {encoding: 'utf8'})
  },
  writeFile: (path:any, content:string) => {
    return fs.writeFile(paths.join(save, `${path}.md`), content, {econding: 'utf8'})
  },
  renameFile: (path:string, newPath:string) => {
    return fs.rename(paths.join(save, `${path}.md`), paths.join(save, `${newPath}.md`));
  },
  deleteFile: (path: string) => {
    return fs.unlink(paths.join(save, `${path}.md`));
  }
}

