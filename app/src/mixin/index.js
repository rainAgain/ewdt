const $path = global.elRequire('path');
const $childProcess = global.elRequire('child_process');
const $fs = global.elRequire('fs');

import { mapActions, mapGetters } from 'vuex';
import { formatRootPath } from 'helper';
/**
 * [loadMore 上滑加载数据]
 * @type {Object}
 */
export const loadMore = {
  directives:{
    'load-more': {
      bind:(el,binding) => {
        let windowHeight = document.body.clientHeight;
        let heightEl;
        let scrollEl = document.body;
        let oldScrollTop;
        let requestFram;

        el.addEventListener('touchstart',() => {
          heightEl = el.clientHeight;
        })
        el.addEventListener('touchmove', () => {
          loadFun();
				}, false)
        const loadFun = () => {
          //console.log(scrollEl.scrollTop + windowHeight,el.clientHeight);
          if (scrollEl.scrollTop + windowHeight> el.clientHeight) {
              //滑到底部时 do something...
              //console.log('滑到底了')
              binding.value();
          } else {
              return false;
          }
        }
      }
    }
  }
}

/**
 * [touchSwipe 左滑删除]
 * js:
 * import { touchSwipe } from 'mixin'
 * export default {
 *  mixins: [touchSwipe]
 * }
 * html:
 *
 * <div class="order-item" v-touch-swipe  data-del-width="200">
 *
 * 说明：
 * v-touch-swipe  为自定义指令
 * 外层class  需要添加overflow-x: hidden;
 *
 * date-del-width  为删除按钮的宽度，不传默认为200
 * @type {Object}
 */
export const touchSwipe = {
  directives: {
    'touch-swipe': {
      bind:(el,binding) => {
        const _delWidth = el.dataset.delWidth||200;
        let touchState = {};
        el.addEventListener('touchstart',()=> {
          const touch = event.touches[0];
          touchState = {};
          touchState.startLeft = touch.pageX;
          touchState.startTop = touch.pageY;
          touchState.maxDistance = _delWidth;
        });
        el.addEventListener('touchmove',() => {
          const touch = event.touches[0];
          touchState.currentLeft = touch.pageX;
          touchState.currentTop = touch.pageY;
          touchState.offsetLeft = touchState.startLeft - touchState.currentLeft;
          touchState.offsetTop = touchState.startTop - touchState.currentTop;

          if (Math.abs(touchState.offsetTop) < 20 && Math.abs(touchState.offsetLeft) > 50) {
            if (touchState.offsetLeft < 0) {
              el.style.transform = `translateX(0px)`;
              el.style.transition = 'all 0.3s linear';
            } else {
              el.style.transform = `translateX(${-touchState.maxDistance}px)`;
              el.style.transition = 'all 0.3s linear';
            }
          }
        });
        el.addEventListener('touchend',() => {
          event.preventDefault();
        });
        el.addEventListener('click',()=>{
            el.style.transform = `translateX(0px)`;
            // el.style.transition = 'all 0.3s linear';
        })
      }
    }
  }
}


/**
 * [commonHandle 处理gulp任务]
 * @param  {[type]} url           [项目绝对地址]
 * @param  {[type]} taskName      [任务名称]
 * @param  {[type]} outFolderName [输出目录名称]
 * @param  {[type]} createFunc    [执行方法]
 * @return {[type]}               [description]
 */
export const execGulpTask = {
  computed:{
    ...mapGetters([
      'rootPath',
      'rootPan'
    ])
  },
  methods:{
    commonHandle(url, taskName, outFolderName, createFunc) {
          const folderPath = formatRootPath(url);  //打开项目目录地址

          const urlStr = url.split($path.sep).join('_').replace(/:/g,'').toLowerCase();//路径分割名称
          //_${this.$path.win32.basename(url)}
          const folderName = `task_${taskName}_${urlStr}`;//gulp任务唯一名称

          const outPath = `${folderPath}/${outFolderName}`; //输出路径

          const task = createFunc(folderName, folderPath, outPath);

          const UniqueName = `s_${folderName}`; //记录用的名称

          //在本地存储任务名
          let task_collection = [];
          if(localStorage['task_collection']) {
              task_collection = JSON.parse(localStorage['task_collection']);
          }
          
          //执行gulp任务的方法
          const execTask = () => {
              const taskCmd = `gulp ${folderName}`
              //此处可能需要区分window环境和linux环境，待测试
              const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;

              $childProcess.exec(execStart)
          }


          //如果任务已经存在则直接执行，否则添加并执行
          if(task_collection.indexOf(UniqueName) > -1) {
              execTask();
          } else {
              $fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  (err) => {
                  if(err) throw err;

                  execTask()

                  task_collection.push(UniqueName);
                  localStorage['task_collection'] = JSON.stringify(task_collection);
              });
          }
    },
    copyProject(url, taskName, createFunc, callback) {
          
          const folderPath = formatRootPath(url);  //打开项目目录地址

          const urlStr = url.split($path.sep).join('_').replace(/:/g,'').toLowerCase();//路径分割名称
          
          //_${this.$path.win32.basename(url)}
          const folderName = `task_${taskName}_${urlStr}`;//gulp任务唯一名称
          
          const prototypePath = `${this.rootPath}/project/prototype`; //要拷贝的项目原型

          const task = createFunc(folderName, prototypePath, folderPath);

          const UniqueName = `s_${folderName}`; //记录用的名称

          //在本地存储任务名
          let auto_collection = [];
          if(localStorage['auto_collection']) {
              auto_collection = JSON.parse(localStorage['auto_collection']);
          }
          
          //执行gulp任务的方法
          const execTask = () => {
              const taskCmd = `gulp ${folderName}`
              //此处可能需要区分window环境和linux环境，待测试
              this.$console(`${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`);
              const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;
              //const execStart = 'code C:\Program Files';
              
              try{
                  $childProcess.exec(execStart, {
                      encoding: 'utf8',
                      timeout: 0,
                      maxBuffer: 200 * 1024,
                      killSignal: 'SIGTERM',
                      cwd: null,
                      env: null
                    }, (error, stdout, stderr) => {
                        if(!error) {
                            this.$console('created success!');
                            if(typeof callback == 'function') {
                              callback();
                            }
                        }
                  })

              } catch(e) {
              }
          }


          //如果任务已经存在则直接执行，否则添加并执行
          if(auto_collection.indexOf(UniqueName) > -1) {
              execTask();
          } else {
              $fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  (err) => {
                  if(err) throw err;

                  execTask()

                  auto_collection.push(UniqueName);
                  localStorage['auto_collection'] = JSON.stringify(auto_collection);
              });
          }
    }
  }
}

export const consoleLog = {
  methods:{
    $console(info) {
      const message = this.$logger.log(info).output;
      this.$store.dispatch('consoleLog', message);
    }
  }
}