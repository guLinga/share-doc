export type defaultFiles = {
  id:string
  title: string
  body?: string
  isNew?: boolean
}[]
const defaultFiles:defaultFiles = [
  {
    id: '1',
    title: 'first post',
    body: '## 1 this is h2'
  },
  {
    id: '2',
    title: 'second post',
    body: '## 2 this is h2'
  },
  {
    id: '3',
    title: 'third post'
  }
]

export default defaultFiles;