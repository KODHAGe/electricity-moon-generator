// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron')
const electron = require('electron');
const configDir =  (electron.app || electron.remote.app).getPath('userData');
const timecut = require('timecut')
let mainWindow; // Lazy stuff

function cut(url, path = configDir + '/animaatio.mp4') {
  timecut({
    url: url,
    viewport: {
      width: 1000,
      height: 600
    },    
    selector: '#header',
    //left: 20, top: 40,
    //right: 6, bottom: 30,
    fps: 30,
    duration: 1,
    output: path
  }).then(function () {
    mainWindow.webContents.send('hide')
  });
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('record', (event, url, path) => {
  cut(url, path)
})