<template lang="html">
  <div class="home">
    <menu class="menu">
      <li class="item" v-for="item in menuList" :key="item.id" @click="jumpLink(item)"> 
          <div class="icon" :class="[item.icon]">
              
          </div>
          <p>{{item.name}}</p>
      </li>
      
    </menu>
  </div>
</template>

<script>


export default {
  name:'home',
  data: () => ({
    home:'',
    home2:'',
    home3:'',
    menuList: [
      { id: 0, name: 'F9x', icon: 'auto', color: '', link:'auto', flag: false },
      // { id: 1, name: '单个打包', icon: 'serve', color: '', link:'serve', flag: false },
      // { id: 2, name: '接口调试', icon: '', color: '', link:'auto', flag: false },
      // { id: 3, name: '网络抓包', icon: '', color: '', link:'auto', flag: false },
      // { id: 4, name: '测试demo', icon: '', color: '', link:'example', flag: false },
      { id: 5, name: '默认配置', icon: 'config', color: '', link:'config', flag: false },
    ]
  }),
  methods: {
      close(){
          window.close();
      }, 
      jumpLink(item) {
          //此处没有用router-link
          //因为后续可能会直接点击跳转到一个新的子进程
          if(!item.flag) {
            this.$router.push({name: item.link})
          } else {
            //打开子进程
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
      //初始化gulpfile.js文件

  },
  beforeCreate() {
    console.log('this is beforeCreate');
  },
  created() {
    console.log('this is created');
  },
  beforeMount() {
      console.log('this is beforeMount');
  },
  mounted() {
      
      console.log('this is mounted');
  },
  beforeUpdate() {
      console.log('this is beforeUpdate');
  },
  updated() {
    console.log('this is updated');
  },
  beforeDestory() {
    console.log('this is beforeDestory');
  },
  destoryed() {
    console.log('this is destoryed');
  },
  watch:{
    "msg":function(val){
      console.log('msg is changed');
    }
  }
}
</script>

<style scoped lang="scss" src="../../assets/style/home/home.scss"></style>
