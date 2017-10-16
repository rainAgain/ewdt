//菜单设置
(()=>{
    const electron = require('electron');
    const remote = electron.remote;
    const Menu = remote.Menu;

    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建项目',
                    accelerator: 'CmdOrCtrl+N',
                    click: function (item, focusedWindow) {
                        newProjectFn();
                    }
                },
                {
                    label: '打开项目…',
                    accelerator: 'CmdOrCtrl+O',
                    click: function (item, focusedWindow) {
                        let projectPath = remote.dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
                        if(projectPath && projectPath.length){
                            openProject(projectPath[0]);
                        }
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
        }
    ]

    let renderMenu = function(template) {
        const menu = Menu.buildFromTemplate(template);
        
        Menu.setApplicationMenu(menu);
    }

    renderMenu(template);
})();
