const isDev = require('electron-is-dev');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const electron = require('electron');
require('@electron/remote/main').initialize()
const Menu  = electron.Menu;

app.on('ready', () => {
  // Menu.setApplicationMenu(null)
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    autoHideMenuBar: true,
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload: "./preload.js",
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  require('@electron/remote/main').enable(mainWindow.webContents)
  if(isDev){
    mainWindow.webContents.openDevTools();
  }
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname,'./build/index.html')}`;
  mainWindow.loadURL(urlLocation);
})