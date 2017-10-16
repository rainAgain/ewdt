# electronAppZoom

## 记录

### 思路

一开始的思路是按照腾讯的工具 tmt-flow来做的，他的思路是复制要操作的项目到应用程序下的某个文件或者是内存中，执行gulp命令后再输出到项目所在地址以dev命名

这里的思路是将gulp、或者其他一些操作依赖的包放置在应用程序中，在进行已有项目单个功能操作的时候，直接获取项目所在的目录地址进行操作并在指定的文件夹位置输出。

### 功能

1). 一键生成 
	
2). 单个打包

### 附加功能

a.可以自己上传js包到指定服务器（有默认服务器），然后进行选择添加那个js包或者其他文件包

b.可以输入cdn地址，进行保存到本地，加入项目中

### 遇到的问题

##### 1、启动服务器

用 gulp-live-server 在启动多个服务器时会报错

根据api修改但是无效，查询github的issuse，有人反馈，但是修改无效，作者不再维护。

所以选用 browser-sync 来用于启动服务器 

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

中的 baseDir, file 可以跨分区(D盘中执行任务，可以监听F盘中的文件)

并且其他任务如gulp-clean-css、 gulp-uglify等任务中的路径均可以跨分区

这样就不用将项目拷贝到应用程序所在目录（即包含依赖包的地址，node_module）


##### 2、gulp 命令 不同硬盘分区

gulp命令中 gulp-rev-all、gulp-css-img-sprite 执行时，操作的文件及文件夹只能是在当前执行node命令时候的文件夹地址，也就是应用程序所在的地址。

解决方法：
修改了gulp-rev-all、gulp-css-img-sprite这两个包并发布到了npm上，用rain-rev-all、rain-css-img-sprite进行引用。

##### 3.



