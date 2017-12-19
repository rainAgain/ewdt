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

//通信
function sendStatusToWindow(text) {
    mainWindow.webContents.send('updatemessage', text);
}

//创建窗口
function createWindow() {
    //检查更新
    autoUpdater.checkForUpdatesAndNotify();
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
    // mainWindow.webContents.openDevTools();
   
    //下载原型
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
        });

        //解压下载的原型zip
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')

                const unzipStream = unzip.Extract({ path: filePath });
                    unzipStream.on('finish',() => {
                        //console.log('finish');
                    });
                    unzipStream.on('end',() => {
                        //console.log('end');
                    });
                    unzipStream.on('close',() => {
                        try {
                            eventTemp.sender.send('download-protype-reply', 'end+'+filePath + fileName);
                        } catch (e) {
                            eventTemp.sender.send('download-protype-reply', 'resumed+');
                        }
                        
                    });
                fs.createReadStream(filePath + '/' + item.getFilename())
                    .pipe(unzipStream)

            } else {
                console.log(`Download failed: ${state}`)
            }
        });
    });

    //关闭应用
    mainWindow.on('closed', function(e) {

        mainWindow = null;
        console.log('closed');
    });
}


//检查更新
autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('检查更新');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('hasUpdate');

    // dialog.showMessageBox({
    //     type: 'info',
    //     title: '找到新版本',
    //     message: '是否希望下载新版本?',
    //     buttons: ['下载', '取消']
    //   }, (buttonIndex) => {
    //     if (buttonIndex === 0) {
    //       autoUpdater.downloadUpdate()
    //     }
    //   })
});

autoUpdater.on('update-not-available', (info) => {
    //已经为最新版
    sendStatusToWindow('noUpdate'+ info.version);
});

autoUpdater.on('error', (err) => {
    //更新失败
    sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    //下载中
    sendStatusToWindow('Downloaded' + progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
    //下载结束
    sendStatusToWindow('Update downloaded');
    dialog.showMessageBox({
        title: '安装更新',
        message: '新版本下载完毕, 程序将退出更新...'
    }, () => {
        setImmediate(() => autoUpdater.quitAndInstall())
    })
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