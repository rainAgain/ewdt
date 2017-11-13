# EWDT

epoint web develop tool

### 运行

首先全局安装 

```
npm install gulp -g
```

[软件中已进行本地安装，为何还要全局安装?](https://www.zhihu.com/question/36023122)


一个 cmd 中启动 vue 本地服务器 ：

```
npm run dev
```

另一个 cmd 中启动 electron ：

```
npm run start
```
***

### 原理

将gulp、或者其他一些操作依赖的包放置在应用程序中，选择要操作的项目，进行处理，</br>
然后在项目同目录进行重命名后输出。在开发过程中，遇到很多无法跨磁盘分区的gulp包，</br>
通过查找和修改部分 npm 包后，实现了window环境下跨分区使用。

***

### 使用

#### sass 语法

1. [sass 使用](http://www.w3cplus.com/sassguide/syntax.html)