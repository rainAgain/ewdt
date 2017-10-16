// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(()=>{
    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;
    const remote = electron.remote;
    const path = require('path');
    const os = require('os');

    //only explose these variable
    window.global.electron = electron;
    window.global.remote = remote;
    window.global.ipcRenderer = ipcRenderer;
    window.global.path = path;
    window.global.os = os;
})();