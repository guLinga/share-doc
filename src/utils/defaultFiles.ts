const Store = window.require('electron-store');
// 测试数据
export const fileStore = {
  "945c7629-749c-4ea7-8fb3-398a058355b2":{"id":"945c7629-749c-4ea7-8fb3-398a058355b2","path":"C:\\Users\\DELL\\Documents\\111.md","title":"111"},
  "d1b57547-76c4-49ec-ac35-acadb5859653":{"id":"d1b57547-76c4-49ec-ac35-acadb5859653","path":"C:\\Users\\DELL\\Desktop\\testmd\\222.md","title":"222"},
  "8fb41b5d-4c1f-4ae1-bf9b-903779b21a51":{"id":"8fb41b5d-4c1f-4ae1-bf9b-903779b21a51","path":"C:\\Users\\DELL\\Desktop\\testmd\\test.md","title":"test"},
  "a2f314fd-2814-4081-84ee-b50d75773503":{"id":"a2f314fd-2814-4081-84ee-b50d75773503","path":"C:\\Users\\DELL\\Desktop\\testmd\\Untitled 1.md","title":"Untitled 1"},
  "65623457-fc1b-457d-b724-31642f8fa082":{"id":"65623457-fc1b-457d-b724-31642f8fa082","path":"C:\\Users\\DELL\\Documents\\1112.md","title":"1112"},
  "4a1aeb7a-fb80-4d22-8074-c892f9aff4aa":{"id":"4a1aeb7a-fb80-4d22-8074-c892f9aff4aa","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 - 副本.md","title":"test - 副本 - 副本"},
  "83989e69-791f-404d-83e3-6a0af9479146":{"id":"83989e69-791f-404d-83e3-6a0af9479146","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (2) - 副本.md","title":"test - 副本 (2) - 副本"},
  "44147566-c01f-4b46-8e08-c93002c837c6":{"id":"44147566-c01f-4b46-8e08-c93002c837c6","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (2).md","title":"test - 副本 (2)"},
  "4b015451-6d34-436e-b295-83089e63501b":{"id":"4b015451-6d34-436e-b295-83089e63501b","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (3) - 副本.md","title":"test - 副本 (3) - 副本"},
  "31af9add-c731-47af-a896-87fb46112e25":{"id":"31af9add-c731-47af-a896-87fb46112e25","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (3).md","title":"test - 副本 (3)"},
  "fd41da53-137a-4cd9-84fa-110479e3b4cb":{"id":"fd41da53-137a-4cd9-84fa-110479e3b4cb","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (4) - 副本.md","title":"test - 副本 (4) - 副本"},
  "847ebf0e-b025-41f1-aafb-3bad15b60f3c":{"id":"847ebf0e-b025-41f1-aafb-3bad15b60f3c","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (4).md","title":"test - 副本 (4)"},
  "f04d0f8b-e08d-4748-b1a2-171dcc457959":{"id":"f04d0f8b-e08d-4748-b1a2-171dcc457959","path":"C:\\Users\\DELL\\Desktop\\testmd\\test - 副本 (5) - 副本.md","title":"test - 副本 (5) - 副本"}}

export type defaultFiles = {
  [key:string]: {
    id:string
    title: string
    body?: string
    isNew?: boolean
    path?: string
    isLoaded?: boolean
  }
}
const defaultFiles:defaultFiles = fileStore

export default defaultFiles;