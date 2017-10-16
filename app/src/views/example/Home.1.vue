<template lang="html">
  <div class="home">
    <div class="pd-b-20">
      <header class="head">
        <top-title :title-config="titleConfig" ></top-title>
        <!-- <head-top></head-top> -->
      </header>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="text">文字按钮</el-button>
      <div>
        <p>es6写法：{{`${msg}${number}-这是字符串`}}</p>
        <p>or</p>
        <p>普通写法：{{msg+number+'-这是字符串'}}</p>
        <p>or</p>
        <p>再普通写法：{{msg}}{{number}}-这是字符串</p>

      </div>
      <div @click="changeMsg" class="init">
          点我改变msg的值
      </div>

      <div class="example" @click="linkTo">
        example
      </div>
      <div class="example" @click="close">
        关闭当前窗口
      </div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import HeadTop from '../../components/header/HeadTop.vue'
import TopTitle from 'TopTitle'

import FootGuide from 'FootGuide'

import { getNearShop, testMock } from 'Api'
import {loadMore} from 'mixin'
export default {
  name:'home',
  components:{
    TopTitle,
    HeadTop,
    FootGuide
  },
  mixins: [loadMore],
  computed:{
    ...mapGetters([
      // 'filterInfo',
      // 'positionInfo'
    ])
  },
  data: () => ({
    msg: "hello guys,let's start Vue | ",
    number: 0,
    titleConfig: {
      title: '首页',
      isShowForward: 0
    }
  }),
  methods: {
    close(){
      window.close();
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
    }
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
