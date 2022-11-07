const isDev = require('electron-is-dev');
const { app, BrowserWindow } = require('electron');
require('@electron/remote/main').initialize()

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      preload: "./preload.js",
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  require('@electron/remote/main').enable(mainWindow.webContents)
  mainWindow.webContents.openDevTools();
  const urlLocation = isDev ? 'http://localhost:3000' : '';
  mainWindow.loadURL(urlLocation);
})