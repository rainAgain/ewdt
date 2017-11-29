const electron = require('electron');
const path = require('path');
const url = require('url');
const unzip = require('unzip');
const fs = require('fs');
const childProcess = require('child_process');
const {autoUpdater} = require("electron-updater");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;

//let installExtension = require('electron-devtools-installer');

let logo = path.join(__dirname, 'icon/favicon.ico');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;
let config = {
    "downloadUrL": 'https://github.com/rainAgain/ewdt/releases/download/V1.0.0/prototype.zip'    //原型文件下载地址
};

function sendStatusToWindow(text) {
    mainWindow.webContents.send('updatemessage', text);
}
  
function createWindow() {
    
    // installExtension.default(installExtension.VUEJS_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
    //Create the browser window.
    
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

        const isDev = process.env.npm_package_env == 'development';

        if( isDev ) {
            mainWindow.loadURL('http://localhost:5010');
        } else {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, './build/index.html'),
                protocol: 'file:',
                slashes: true
            }));

        }
    

   

    // 加载完毕显示
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
   

    //download
    var eventTemp = null;
    ipc.on('download-protype',function(event, arg) {
        if(arg.split('+')[0] == 'begin') {

            mainWindow.webContents.downloadURL('https://github.com/rainAgain/ewdt/releases/download/'+arg.split('+')[1]+'/prototype.zip');
            eventTemp = event;
        }
    });
    
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        //设置文件存放位置
        const filePath = path.join(__dirname, './gulprepo/project/');
        //console.log(filePath);
        const fileName = item.getFilename();
        item.setSavePath(filePath + fileName);

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
                        try {
                            eventTemp.sender.send('download-protype-reply', 'end+'+filePath + fileName);
                        } catch (e) {
                            eventTemp.sender.send('download-protype-reply', 'resumed+');
                        }
                        
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

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('hasUpdate');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('noUpdate');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow('Downloaded' + progressObj.percent + "%");
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    autoUpdater.quitAndInstall();
});


app.on('ready', createWindow);

app.on('window-all-closed', app.quit);

app.on('before-quite', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});


//加载完后就检查更新
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});