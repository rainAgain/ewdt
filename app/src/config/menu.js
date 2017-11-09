const electron = global.elRequire('electron');
const BrowserWindow = electron.BrowserWindow;
const remote = electron.remote;

const path = require('path');
const url = require('url');

"use strict";

const Menu = remote.Menu;

var template = [
    {
        label: '文件',
        submenu: [
        	{
                label: '配置',
                accelerator: 'CmdOrCtrl+B',
                click: function(item, focusedWindow) {
                    //focusedWindow.loadURL('file://'+ path.join(__dirname, './build/index.html/#/config'));
                    // focusedWindow.loadURL(url.format({
                    //   pathname: path.join(__dirname, './build/index.html/#/config'),
                    //   protocol: 'file:',
                    //   slashes: true
                    // }));
                    
                	focusedWindow.loadURL('http://localhost:5010/#/config');
                }
            },
            {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            }
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
            {
                label: '最小化',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: '关闭窗口',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: '调试模式',
                accelerator: 'Option+CmdOrCtrl+I',
                click: function () {
                    if(remote.getCurrentWindow().webContents.isDevToolsOpened()){
                        remote.getCurrentWindow().webContents.closeDevTools();
                    }else{
                        remote.getCurrentWindow().webContents.openDevTools({mode: 'undocked'});
                    }
                }
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: 'Ewdt 使用帮助',
                click: function () {
                    electron.shell.openExternal('https://gitee.com/wckz/ElectronAppZoom');
                }
            },
            {
                label: 'Ewdt 官网',
                click: function () {
                    electron.shell.openExternal('https://gitee.com/wckz/ElectronAppZoom');
                }
            },
            {
                label: '建议 或 反馈…',
                click: function () {
                    electron.shell.openExternal('https://gitee.com/wckz/ElectronAppZoom/issues');
                }
            }
        ]
    }
];

// var menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);



function showConfig() {

    let win = new BrowserWindow({
        width: 360,
        height: 400,
        resizable: false,
        title: '配置'
    });

    let aboutPath = 'http://localhost:5010/config';
    win.loadURL(aboutPath);

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}