const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

//单个打包系统对话框
// ipc.on('open-file-dialog', function(event) {

//     dialog.showOpenDialog({
//         properties: ['openFile', 'openDirectory']
//     }, function(files) {
//         if (files) event.sender.send('selected-directory', files);
//     });
// });

//一键生成系统对话框
// ipc.on('open-file-dialog-auto', function(event) {

//     dialog.showOpenDialog({
//         filters: [
//             {name: 'e-config', extensions: ['json']}
//         ]
//     }, function(files) {
//         if (files) event.sender.send('selected-directory-auto', files);
//     });
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // installExtension(VUEJS_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
    // Create the browser window.
    
    mainWindow = new BrowserWindow({ width: 400, height: 600, minWidth: 400, minHeight: 600 });

    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, './test.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))

    mainWindow.loadURL('http://localhost:5010');

    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, './build/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))

    //console.log(process.env.NODE_ENV);
    // 加载完毕显示
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);



// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
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