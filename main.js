const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipc = electron.ipcMain;
const dialog = electron.dialog;
const childProcess = require('child_process');

//let installExtension = require('electron-devtools-installer');


let logo = path.join(__dirname, 'assets/favicon.ico');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;

function createWindow() {
    
    // installExtension.default(installExtension.VUEJS_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
    // Create the browser window.
    
    mainWindow = new BrowserWindow({
        width: 400, 
        height: 600, 
        minWidth: 400, 
        minHeight: 600,
        title: 'EWDT',
        icon: logo
        // titleBarStyle: 'hiddenInset',
        // frame: false,
        // transparent: true,
        // webPreferences: {
        //     nodeIntegration: false  //阻止原生的node模块
        // }
        });

    //mainWindow.loadURL('http://localhost:5010');

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // 加载完毕显示
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {

        //mainWindow.removeAllListeners();
        mainWindow = null;
        console.log('closed');


    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
    console.log('window-all-closed');

});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
