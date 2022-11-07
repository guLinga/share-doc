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