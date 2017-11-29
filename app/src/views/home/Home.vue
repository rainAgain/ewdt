<template lang="html">
  <div class="home">
    <menu class="menu">
      <li class="item" v-for="item in menuList" :key="item.id" @click="jumpLink(item)"> 
          <div class="icon" :class="[item.icon]">
              
          </div>
          <p>{{item.name}}</p>
      </li>
      <!-- 检查更新 -->
      <li class="item" @click="checkUpdate"> 
          <div class="icon update">
              
          </div>
          <p>{{updateContent}}</p>

        <!-- <Circle :percent="percent" :stroke-color="color">
            <Icon v-if="percent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
            <span v-else style="font-size:24px">{{ percent }}%</span>
        </Circle> -->
      </li>
    </menu>
  </div>
</template>

<script>

const $electron  = global.elRequire('electron');
const $ipcRenderer = $electron.ipcRenderer;
const $shell = $electron.shell;

export default {
  name:'home',
  data: () => ({
    home:'',
    home2:'',
    home3:'',
    percent: 0,
    updateContent: '检查更新',
    menuList: [
      { id: 0, name: 'F9x', icon: 'auto', color: '', link:'auto', flag: 0 },
      // { id: 1, name: '单个打包', icon: 'serve', color: '', link:'serve', flag: false },
      // { id: 2, name: '接口调试', icon: '', color: '', link:'auto', flag: false },
      // { id: 3, name: '网络抓包', icon: '', color: '', link:'auto', flag: false },
      // { id: 4, name: '测试demo', icon: '', color: '', link:'example', flag: false },
      { id: 5, name: '默认配置', icon: 'config', color: '', link:'config', flag: 0 },
      { id: 7, name: '使用说明', icon: 'use', color: 'use', link:'https://github.com/rainAgain/ewdt', flag: 1 }
    //   { id: 6, name: '检查更新', icon: 'update', color: '', link:'update', flag: 0 }
      
    ]
  }),
   computed: {
        color () {
            let color = '#2db7f5';
            if (this.percent == 100) {
                color = '#5cb85c';
            }
            return color;
        }
    },
  methods: {
      close(){
          window.close();
      }, 
      jumpLink(item) {
          //flag 为 0 表示vue内部路由, 1 为外部链接
          
          //此处没有用router-link
          //因为后续可能会直接点击跳转到一个新的子进程
          if(!item.flag) {
            this.$router.push({name: item.link})
          } else if(item.flag == 1) {
            $shell.openExternal(item.link);
          } else {
              //
          }
      },
      linkTo() {
          this.$router.push({name: 'example'})
      },
      changeMsg() {
          this.msg = "you changed me";
          this.number ++;
      },
      otherFun() {
          console.log('')
      },
      checkUpdate() {

      }
      //初始化gulpfile.js文件

  },
  mounted() {
    $ipcRenderer.on('updatemessage', (event, text) => {
        if(text == "hasUpdate") {
            this.updateContent = "有新版本"
        } else if(text == "noUpdate") {
            this.updateContent = "已是最新"
        } else if(text.indexOf('Downloaded') > -1) {
            this.updateContent = text.split('Downloaded')[1];
        }
    })
  },
//   beforeCreate() {
//     console.log('this is beforeCreate');
//   },
//   created() {
//     console.log('this is created');
//   },
//   beforeMount() {
//       console.log('this is beforeMount');
//   },
//   mounted() {
      
//       console.log('this is mounted');
//   },
//   beforeUpdate() {
//       console.log('this is beforeUpdate');
//   },
//   updated() {
//     console.log('this is updated');
//   },
//   beforeDestory() {
//     console.log('this is beforeDestory');
//   },
//   destoryed() {
//     console.log('this is destoryed');
//   },
  watch:{
    "msg":function(val){
      console.log('msg is changed');
    }
  }
}
</script>

<style scoped lang="scss" src="../../assets/style/home/home.scss"></style>
