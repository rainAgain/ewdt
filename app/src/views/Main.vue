<template lang="html">
    <div class="main">
        <div class="contain">
            <div class="home-title" @click="linkTo('home')">ewdt</div>
            <transition name="router-fade" mode="out-in">
                <!-- 待定，是否需要缓存 -->
                <!-- <keep-alive> -->
                  <router-view></router-view>
                <!-- </keep-alive> -->
              </transition>

            <!-- log显示 -->
            <div class="console-contain">
                <div class="console-btn" @click="toggleConsole">
                  >_
                </div>
                <transition name="slide-fade">
                  <div class="console-pd" v-if="show" >
                      <i class="clean-console" title="clean console" @click="clean"></i>
                      <div class="console-box">
                          <ul>
                              <li ref='li' v-for="(item,index) in consoleList" :key="index">{{item}}</li>
                          </ul>
                      </div>
                  </div>
                </transition>
            </div>
            <div v-if="!show" class="version">{{versionText}}</div>
        </div>
    </div>
</template>

<script>
//require('../config/location.js');
const $path = global.elRequire('path');
const $fs = global.elRequire('fs');
const $electron  = global.elRequire('electron');
const $ipcRenderer = $electron.ipcRenderer;
const $remote = $electron.remote;
const $dialog = $remote.dialog;

import {formatRootPath} from 'helper';
import { mapGetters } from 'vuex';
export default {
    name: 'main',
    data () {
        return {
            show: false,
            openNames:['常用工具'],
            versionText:'检查更新中…',
            menuList:[
                {
                    id:0,
                    name:'常用工具',
                    icon: 'ios-paper',
                    route:'',
                    child:[
                    {
                        id: 0,
                        name: '启动服务器',
                        icon: '',
                        route: 'serve'
                    },
                    {
                        id:1,
                        name: '压缩css',
                        icon: '',
                        route: 'compressCss'
                    },
                    {
                        id:2,
                        name: '压缩js',
                        icon: '',
                        route: 'compressJs'
                    },
                    {
                        id:3,
                        name: '合并图片',
                        icon: '',
                        route: 'mergePic'
                    }
                    ]
                }
            ]
        }
    },
    computed:{
    ...mapGetters([
            'consoleList'
        ])
    },
    methods:{
        linkTo(name) {
            this.$router.push({name: name});
        },
        toggleConsole() {
            this.show = !this.show;
            if(this.show) {
            this.showConsole();
            }
        },
        initGulpFile() {
                
            let rootName = $path.resolve(); //gulpfile.js所在目录
            this.home = rootName;

            this.home2 = 'env:' + $remote.process.env.npm_package_env;

            //package.json中存在env参数，则表示为开发环境
            //生产环境下获取不到package.json所以取不到该参数
            if($remote.process.env.npm_package_env != 'development') {
                
                //发布环境
                //后面可能需要区分window和linux环境的路径
                rootName = `${rootName}\\resources\\app.asar.unpacked\\gulprepo`;
            } else {
                rootName = `${rootName}\\gulprepo`;
            }
            this.home3 = 'rootName:' + rootName;
            let rootInfo = {};

            rootInfo.rootPath = formatRootPath(rootName);
            rootInfo.rootPan = rootInfo.rootPath.split(':')[0];
        
            this.$store.dispatch('getRoot', rootInfo);

            const content = `const gulp = require('gulp');
const browserSync  = require('browser-sync');

const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const base64 = require('gulp-base64');
const rainRevAll = require('rain-rev-all');
const sprite = require('rain-css-img-sprite');
const rename = require('gulp-rename');
const rimrafFolder = require('rimraf');
const rimraf = require('gulp-rimraf');
const sass = require('gulp-sass');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const csso = require('gulp-csso');
const gulpSequence = require('gulp-sequence');

const pump = require('pump');

        `
            $fs.writeFile(`${rootInfo.rootPath}/gulpfile.js`, content, () => {
                console.log('初始化gulpfile.js成功');
            })
        },
        showConsole() {
            if(this.show) {
                const len = this.consoleList.length;
                if(len) {
                    this.$nextTick(() => {
                        this.$refs.li[len-1].scrollIntoView();
                    });
                }
            }
        },
        clean() {
            this.$store.dispatch('cleanConsole');

        },
        closePage() {
            let closeWindow = false

            //$ipcRenderer.once('beforeunload',evt => {
            window.addEventListener('beforeunload', evt => {
                if (closeWindow) return

                evt.returnValue = false

                setTimeout(() => {
                    let result = $dialog.showMessageBox({
                        message: '是否确认退出应用?',
                        buttons: ['是', '否']
                    })

                    if (result == 0) {
                        
                        closeWindow = true;

                        this.$store.dispatch('setClose');
                    }
                }, 16)
            })
        }
    },
    mounted() {
        this.initGulpFile();
        this.showConsole();

        const initConfig = !!localStorage.d_config && localStorage.d_config != 'undefined' ? JSON.parse(localStorage.d_config) : {
            port: '9800', //端口
            startPath: '/pages/default/index.html', //默认启动页
            outName: '-dist'
        };

        this.$store.dispatch('saveConfig', initConfig);
        
        this.closePage();


        $ipcRenderer.on('updatemessage', (event, text) => {
            if(text == "hasUpdate") {
                this.versionText = "有新版本"
            } else if(text.indexOf('noUpdate') > -1) {
                this.versionText = "已是最新 v" + text.split('noUpdate')[1];
            } else if(text.indexOf('Downloaded') > -1) {
                const percent = Math.floor(+text.split('Downloaded')[1]);
                this.versionText = "正在更新 " + percent + '%';
            }
        })
    },
    watch: {
        "consoleList": function(val) {
            if(val.length) {
                this.showConsole();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .main{
      height: 100%;
      .contain {
          height: 100%;

          .home-title {
            position: fixed;
            top: 50%;
            right: 0;
            z-index: 100;

            width: 40px;
            height: 40px;
            
            text-align:center;
            line-height: 40px;
            border-radius: 50%;

            background-color: #f00;
            color: #fff;
            cursor: pointer;
          }
          
          .console-contain {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              
              background-color: rgba(51,51,51,.8);
              .console-pd {
                  padding: 5px 0;
                  .clean-console {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    z-index: 20;
                    
                    width: 20px;
                    height: 20px;
                    background-image: url('../assets/imgages/clear.png');
                    background-repeat: no-repeat;
                    background-size: 100%;
                    font-size: 20px;
                    color: #ececec;

                    &:hover {
                      background-image: url('../assets/imgages/clear-hover.png');
                    }
                  }
              }
              .console-box {
                  
                  width: 100%;
                  height: 66px;
                  
                  overflow-y: auto;

                  ul {
                      
                      li {
                          position: relative;
                          line-height: 14px;
                          font-size: 12px;
                          color: #fff;
                          padding-left: 12px;

                          &:after{
                            content:'>';
                            position: absolute;
                            left: 2px;
                            top: 0;
                            line-height: 14px;
                            margin-right: 3px;
                          }
                      }
                  }
              }

              .console-btn {
                position: absolute;
                top: -20px;
                right: 0;

                width: 30px;
                height: 20px;
                padding-left:5px;
                
                color:#21f36d;
                border: 1px solid #ccc;
                cursor: pointer;
              }
          }
      }
      .version {
          line-height: 20px;
          font-size: 12px;
          color: #666;
          padding-left: 10px;
          position: absolute;
          bottom:0;
          left: 0;
      }
      
  }
  .router-fade-enter-active, .router-fade-leave-active {
      transition: opacity .2s;
  }
  .router-fade-enter, .router-fade-leave-active {
      opacity: 0;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(0px);
    opacity: 0;
  }
</style>
