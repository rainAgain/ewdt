# electronAppZoom

## 记录

### 思路

一开始的思路是按照腾讯的工具 tmt-flow 来做的，他的思路是复制要操作的项目到应用程序下的某个文件或者是内存中，执行gulp命令后再输出到项目所在地址以dev命名

这里的思路是将gulp、或者其他一些操作依赖的包放置在应用程序中，在进行已有项目单个功能操作的时候，直接获取项目所在的目录地址进行操作并在指定的文件夹位置输出。

### 功能

1). 一键生成 
	
2). 单个打包

### 附加功能

a.可以自己上传 js 包到指定服务器（有默认服务器），然后进行选择添加那个 js 包或者其他文件包

b.可以输入 cdn 地址，进行保存到本地，加入项目中

### 遇到的问题

##### 1、启动服务器

用 `gulp-live-server` 在启动多个服务器时会报错

根据api修改但是无效，查询 `github` 的 `issuse`，有人反馈，但是修改无效，作者不再维护。

所以选用 `browser-sync` 来用于启动服务器 

做的时候发现

```
gulp.task('serve', function() {
    browserSync.init({
        files:['**'],
        server:{
            baseDir:'./project/',
            index:'index.html'
        },
        port: 9001
    });
});
```

中的 `baseDir`, `file` 可以跨分区( D 盘中执行任务，可以监听 F 盘中的文件)

并且其他任务如 `gulp-clean-css`、 `gulp-uglify` 等任务中的路径均可以跨分区

这样就不用将项目拷贝到应用程序所在目录（即包含依赖包的地址，`node_module` ）


##### 2、gulp 命令 不同硬盘分区

`gulp` 命令中 `gulp-rev-all`、`gulp-css-img-sprite` 执行时，操作的文件及文件夹只能是在当前执行 `node` 命令时候的文件夹地址，也就是应用程序所在的地址。

解决方法：
修改了 `gulp-rev-all`、`gulp-css-img-sprite` 这两个包并发布到了 `npm` 上，用 `rain-rev-all`、`rain-css-img-sprite` 进行引用。

##### 3.不适用 asar 加密

不适用 `asar` 加密，本项目涉及到文件修改，`asar` 文件是只读文件，且目录结构属于'虚拟结构'。

##### 4.封装

不用 `electron-builder` ，因为不能自定义安装界面，也不能选择安装目录，故选用 `NSIS` 来封装。 [NSIS教程](http://blog.csdn.net/cwt19902010/article/details/52923163)


##### 5.gulp 一键打包需要按顺序执行

`gulp` 任务同步（按顺序）执行，插件 [gulp-sequence](https://www.npmjs.com/package/gulp-sequence)。

##### 6.css 压缩

压缩 `css`，弃用 `gulp-clean-css` 改用 `gulp-csso` 或者 `gulp-uglifycss` ,前者会优化 css 后压缩，后者纯压缩，类似 `YUI Compressor` 的 css 压缩。

##### 7.child_process 的 exec 问题

`child_process` 的 `exec` 方法，在传入的 `command` 命令调用没有结束时，不会触发回调方法，整个进程结束后才执行回调。

##### 8.执行持续状态的命令

不用 `child_process` 的 `exec` 来执行，改用 `spawn` ，代码如下：

```
const taskCmd = `gulp ${folderName}`;
const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;

this.$console(execStart);

//这种写法，解决spawn不执行的问题
const args = [
    "/S",
    "/C",
    '"',
    execStart].concat('"');

const loader = $spawn("cmd.exe", args, {
    cwd: null, 
    env: {
        ELECTRON_NO_ASAR: true,
        ELECTRON_RUN_AS_NODE: true
    },
    windowsVerbatimArguments: true,
    detached: false
});

loader.stdout.on('data', (data) => {

    //这边返回了多次，所以用一个flag标记一下只执行一次
    if(!flag) {
        //logFile(`[create Serve Success]`)
        flag = true;
        item.execChild = loader.pid;
        
        this.$set(this.projectList[index],'isActive',true);

        //需要更新localstorage的数据
        localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));

        this.$console('LiveLoad started!');
    }
    
});

loader.stderr.on('data', (data) => {
    // logFile(`[spawn faild] ${data}`)
});

loader.on('exit', (code) => {
    //logFile(`[loader exit] ${code}`);

    loader.removeAllListeners()
});
```

##### 9. 退出软件时，子进程不关闭的问题

一开始用的监听软件退出时的 `close` 事件,但是因为由于会有多个子进程需要一个一个退出，存在异步的情况，无法确保所有子进程都关闭，所以改用 `beforeunload` ,在体验上不是很好，但是可以确保子进程全部退出关闭。

代码如下：

```
let closeWindow = false

window.addEventListener('beforeunload', evt => {
    if (closeWindow) return

    evt.returnValue = false

    setTimeout(() => {
        let result = $dialog.showMessageBox({
            message: '是否确认退出应用?',
            buttons: ['是', '否']
        })

        if (result == 0) {
            closeWindow = true

            if(this.projectList.length) {
        
                this.projectList.forEach((item, index) => {

                    //不管是否启动都执行
                    item.isActive = false;
                    localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));
                    
                    this.closeServe(item, index, true);
                });
            }

            $currentWindow.close();
            $currentWindow.removeAllListeners('close');
        }
    }, 16)
})
```