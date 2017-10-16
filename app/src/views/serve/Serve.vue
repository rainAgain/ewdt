<template>
    <div id="serve" class="serve">

        <div class="content">
            <div class="btns-box">
                <Button type="ghost" title="添加文件夹" class="btns" shape="circle" icon="plus-round" @click="openFile"></Button>
                <Button type="ghost" title="压缩css" class="btns" shape="circle" @click="miniCss">minify-css</Button>
                <Button type="ghost" title="autoprefixer" class="btns" shape="circle" @click="autoprefixer">autoprefixer</Button>
                <Button type="ghost" title="压缩js" class="btns" shape="circle" @click="uglify">uglifyJs</Button>
                <Button type="ghost" title="转换图片为base64" class="btns" shape="circle" @click="base64">base64</Button>
                <Button type="ghost" title="合并雪碧图" class="btns" shape="circle" @click="sprite">sprite</Button>
                <Button type="ghost" title="添加Hash后缀" class="btns" shape="circle" @click="hash">hash</Button>
                
                <Button type="ghost" title="清空文件夹" class="btns" shape="circle" @click="clearAll">clearAll</Button>
            </div>

            <div>
              <ul>
                <li class="file" :class="{active : index == selected}" v-for="(item,index) in projectList" :key="index" @click="select(item,index)">
                    <div class="item-folder">
                        <Icon class="file-folder" type="folder"></Icon>
                    </div>
                    <div class="item-file">
                        <p class="title">{{item.name}}</p>
                        <p :title="item.folderPath" class="path">{{item.folderPath}}</p>
                    </div>
        
                    <div class="item-operation">
                        <i-switch class="switch" color="#f00" size="small" v-model="item.isOn" @on-change="start(item)"></i-switch>
                        
                        <Icon class="operation-btn" title="刷新" type="ios-refresh-outline" @click.native="refresh(item)"></Icon>

                        <Icon class="operation-btn" type="ios-trash-outline" title="删除" @click.native="deleteItem(item)"></Icon>
                    </div>

                </li>
              </ul>
            </div>

        </div>
    </div>
</template>
<script>
    const $electron  = global.elRequire('electron');
    const $remote = $electron.remote;
    const $path = global.elRequire('path');
    const $fs = global.elRequire('fs');
    const $childProcess = global.elRequire('child_process');

    import { formatRootPath } from 'helper';
    import {
      createServerTask,
      createMiniCss,
      createAutoprefixer,
      createUglify,
      createBase64,
      createSprite,
      createHash
    } from 'GulpTask';

    import { mapGetters } from 'vuex';
    import { execGulpTask } from 'mixin'

    export default {
        name: "serve",
        data: () => ({
            msg: '添加文件',
            port: 9001,
            folderInfo: {
                folderName:'',
                folderPath:''
            },
            choose: null,
            switch1: false,
            selected: null,
            path: '',
            projectList: []
        }),
        components: {
        },
        computed:{
            ...mapGetters([
                'rootPath',
                'rootPan'
            ])
        },
        mixins:[execGulpTask],
        methods: {
          //打开目录
          openFile() {
              const dialog = $remote.dialog;

              dialog.showOpenDialog({
                  properties: ['openFile', 'openDirectory']
              }, (path)=> {
                try {

                    const folderPath = path[0];
                    const folderName = $path.win32.basename(folderPath);

                    this.projectList.push({
                        id: this.projectList.length,
                        name: folderName,
                        folderPath: folderPath,
                        isActive: false,
                        isStart: false
                    });

                    localStorage.setItem('project_collection', JSON.stringify(this.projectList));
                } catch(e) {

                  console.log('没有选择');
                }
                
              });
              //this.$ipc.send('open-file-dialog')
          },
          select(item, index) {
              this.selected = index;
              this.choose = item;
          },
          //启动项目
          start(item) {
              const status = item.isOn ? '启动' : '关闭';

              if(!item.folderPath) {
                return;
              }

              //执行命令
              if(item.isOn) {
                  try {
                      const folderPath = formatRootPath(item.folderPath);  //打开目录地址

                      const folderName = `task_${$path.win32.basename(item.folderPath)}`;  //name

                      const files = `['${folderPath}/**']`

                      const task = createServerTask(folderName, folderPath, files, this.port);

                      $fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  () => {

                          const taskCmd = `gulp ${folderName}`;
                          const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;

                          item.execChild = $childProcess.exec(execStart);
                      });

                  } catch(e) {
                      console.log(e);
                  }

              } else {
                  const execClose = `taskkill /pid ${item.execChild.pid} -t -f`;

                  $childProcess.exec(execClose);
              }
              
              this.$Message.info(status);
          },
          refresh(item) {
              console.log(item);
          },
          deleteItem(item) {
              console.log(item);
          },
          miniCss() {
              if(!this.choose) {
                this.$Message.warning("请先选择要minicss的项目");
                return ;
              }
              this.commonHandle(this.choose.folderPath, 'minify_css', 'miniDist', createMiniCss);
          },
          autoprefixer() {
              if(!this.choose) {
                  this.$Message.warning("请先选择要autoprefixer的项目");
                  return ;
              }

              this.commonHandle(this.choose.folderPath, 'autoprefixer', 'autoprefixerDist', createAutoprefixer);
          },
          uglify() {
              if(!this.choose) {
                  this.$Message.warning("请先选择要uglify的项目");
                  return ;
              }
              this.commonHandle(this.choose.folderPath, 'uglify', 'compressJs', createUglify);
          },
          base64() {
              if(!this.choose) {
                  this.$Message.warning("请先选择要转换图片的项目");
                  return ;
              }
              this.commonHandle(this.choose.folderPath, 'base64', 'base64Dest', createBase64);
          },
          sprite() {
              if(!this.choose) {
                  this.$Message.warning("请先选择要合并雪碧图的项目");
                  return ;
              }
              this.commonHandle(this.choose.folderPath, 'sprite', 'spriteDest', createSprite);
          },
          hash() {
              if(!this.choose) {
                  this.$Message.warning("请先选择要进行hash的项目");
                  return ;
              }
              this.commonHandle(this.choose.folderPath, 'hash', 'hashDest', createHash);
          },
          clearAll() {
              localStorage.clear();
              this.initData();
          },
          //初始化列表数据
          initData() {
              this.projectList  = localStorage['project_collection'] ? JSON.parse(localStorage['project_collection']) : [];
          }
        },
        created() {
            this.initData();
        },
        mounted() {

        }
    }
</script>
<style lang="scss" scoped src="../../assets/style/serve/serve.scss"></style>