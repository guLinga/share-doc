> 安装依赖
```
npm install
```
安装依赖的过程有点慢，请耐心等待。
如果你遇到报错的情况，可能会出现`node install.js`的报错，这是因为安装`electron`时会下载一个包，如果网速慢长时间下载不下来救会报错。你可以切换npm镜像。
```
npm config set electron_mirror "https://npm.taobao.org/mirrors/electron/"
```

> 运行项目
```
npm run dev
```

> 项目介绍
这是一个在线编译markdown的软件，你可以执行对markdown文件的任意操作。例如：新增、删除、修改、编辑。

> 项目技术栈
electron + react hooks + typescript

> 项目问题
项目的文件会储存在你的c盘下的文档里面。
关于文件列表的储存我尝试过使用electron-store进行储存，但是这样会导致应用十分的卡顿，于是我使用了localStorage来进行存储。
这些情况您不必担心，后续会使用数据库进行优化。

> 功能增加
1. 左侧文件列表宽度拖拽。
2. 点击左侧文件管理，可以显示和左侧文件列表
3. 每次进入应用的使用，按照时间排序读取一下目录，获取文件列表，我做过处理，只有在打开的时候才会读取目录，不用担心每次刷新都会重新读取。

> 修改
1. 将数组储存转换成对象存储，如果是数组的话我们每次删除修改都要查找一遍数组，如果是对象的我们可以直接获取到对象中是否有id的值。