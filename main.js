const electron = require('electron');
const path = require('path');
const url = require('url');
const unzip = require('unzip');
const fs = require('fs');
const childProcess = require('child_process');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;

//let installExtension = require('electron-devtools-installer');

let logo = path.join(__dirname, 'assets/favicon.ico');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;
let config = {
    "downloadUrL": 'https://github.com/rainAgain/ewdt/releases/download/V1.0.0/prototype.zip'    //原型文件下载地址
};

function createWindow() {
    
    // installExtension.default(installExtension.VUEJS_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
    // Create the browser window.
    
    mainWindow = new BrowserWindow({
        width: 680, 
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

        const isDev = process.env.npm_package_env == 'development';

        if( isDev ) {
            mainWindow.loadURL('http://localhost:5010');
        } else {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, './build/index.html'),
                protocol: 'file:',
                slashes: true
            }))
        }
    

   

    // 加载完毕显示
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
   

    //download
    var eventTemp = null;
    ipc.on('download-protype',function(event, arg) {

        if(arg == 'begin') {
            
            mainWindow.webContents.downloadURL(config.downloadUrL);
            eventTemp = event;
        }
    });
    
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        //设置文件存放位置
        const filePath = path.join(__dirname, './project/');
        //console.log(filePath);
        item.setSavePath(filePath + item.getFilename());
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
                eventTemp.sender.send('download-protype-reply', 'resumed+');
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')

                const unzipStream = unzip.Extract({ path: filePath });
                    unzipStream.on('finish',() => {
                        //console.log('finish');
                    })
                    unzipStream.on('end',() => {
                        //console.log('end');
                    })
                    unzipStream.on('close',() => {
                        //console.log('close');
                        eventTemp.sender.send('download-protype-reply', 'end+'+filePath +item.getFilename());
                        eventTemp = null;
                        // setTimeout(() => {
                        //     fs.unlink(filePath +item.getFilename(),(err) => {
                        //         if(err) console.log(err);
                                
                        //     })
                        // },1000);
                        
                    })
                fs.createReadStream(filePath + '/' + item.getFilename())
                    .pipe(unzipStream)

            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })

    //download end
    mainWindow.on('closed', function(e) {

        //mainWindow.removeAllListeners();
        mainWindow = null;
        //e.preventDefault();
        
        console.log('closed');


    });
}


app.on('ready', createWindow);

// Quit when all windows are closed.
// app.on('window-all-closed', function() {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
//     console.log('window-all-closed');

// });

app.on('window-all-closed', app.quit);

app.on('before-quite', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
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
