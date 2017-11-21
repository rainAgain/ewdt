# EWDT

epoint web develop tool

### 运行

首先全局安装 

```
npm install gulp -g
```

[软件中已进行本地安装，为何还要全局安装?](https://www.zhihu.com/question/36023122)

#### 本地运行：

一个 cmd 中启动 vue 本地服务器 ：

```
npm run dev
```

另一个 cmd 中启动 electron ：

```
npm run start
```
***

#### 发布：

第一步

```
npm run build
```

第二步

```
npm run pack
```

### 原理

利用 Electron + gulp + vue 进行开发。</br>
将gulp、或者其他一些操作依赖的包放置在应用程序中，选择要操作的项目，进行处理，</br>
然后在项目同目录进行重命名后输出。在开发过程中，遇到很多无法跨磁盘分区的gulp包，</br>
通过查找和修改部分 npm 包后，实现了window环境下跨分区使用。

***



### 安装

A. window 中 安装路径请使用英文路径，不能带空格或者特殊字符，如: D:\soft;

B. mac 待测试

### 使用

#### 创建 

点击创建后，选择要项目文件夹的根目录，用来启动 browserSync（前端测试刷新工具）静态服务器。

可以选择是否使用 sass 编译。

#### 添加

添加项目后，需手动启动 browserSync（前端测试刷新工具）静态服务器。

启动后会监听scss文件，并自动编译。

#### sass 语法

1. [sass 使用](http://www.w3cplus.com/sassguide/syntax.html)