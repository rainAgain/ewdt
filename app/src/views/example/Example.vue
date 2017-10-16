<template lang="html">
  <div class="example">
    <p class="desc">{{msg}}</p>

    <p class="count">{{count}}</p>

    <p>改变vuex中store的值</p>
    <div class="btn" @click="add">
      点我啊
    </div>

    <div class="btn" @click="queryAllAdverInfo">
      接口请求
    </div>

    <div class="btn" @click="openNew">打开file</div>
    
    <p>{{electron}}</p>

    

    <p v-if="test">请求结果：{{test}}</p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import {queryAllAdverInfo} from 'Api'

export default {
  name: 'example',
  data: () => ({
    msg: '这是个vuex的使用栗子,刷新会重置',
    test: '',
    electron:''
  }),
  computed:{
    ...mapGetters([
      'count'
    ])
  },
  methods:{
    add() {
      const number = this.count +4;
      this.$store.dispatch('increaseCount', number);
    },
    queryAllAdverInfo() {
      queryAllAdverInfo(
        // {
        //   activityDay: 1
        // }
      ).then((res)=>{
        console.log(res)
        this.test = res.data;
      })
    },
    openNew() {
      console.log(global.electron)
      this.electron = global.electron;
      const shell = global.electron.shell
      const os = global.os

      shell.showItemInFolder(os.homedir())
    }
  },
  mounted() {
    //this.queryAllAdverInfo();
  }
}
</script>

<style lang="scss" scoped>
  .example {
    .desc {
      padding: 20px 0;
      color: #f60;
    }

    .count {
        padding:20px 0 20px 10px;
        font-size: 40px;
    }

    .btn {
      padding: 20px;
      width: 180px;
      text-align: center;
      margin-top: 20px;

      background-color: #456;
      color: #fff;
    }
  }
</style>
