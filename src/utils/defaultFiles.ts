const Store = window.require('electron-store');
export const fileStore = new Store({'name': 'FilesData'});

export type defaultFiles = {
  id:string
  title: string
  body?: string
  isNew?: boolean
  path?: string
  isLoaded?: boolean
}[]
const defaultFiles:defaultFiles = fileStore

export default defaultFiles;

/*
[
  {
    id:string
    title: string
    body?: string
    isNew?: boolean
    path?: do
    isLoaded?: boolean
  },
  {
    id:string
    title: string
    body?: string
    isNew?: boolean
    path?: ot
    isLoaded?: boolean
  },
  {
    id:string
    title: string
    body?: string
    isNew?: boolean
    path?: do
    isLoaded?: boolean
  }
]
*/

// [3,4,5,6]