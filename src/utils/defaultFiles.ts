const Store = window.require('electron-store');
export const fileStore = new Store({'name': 'FilesData'});

export type defaultFiles = {
  id:string
  title: string
  body?: string
  isNew?: boolean
}[]
const defaultFiles:defaultFiles = fileStore

export default defaultFiles;