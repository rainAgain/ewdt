import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import actions from './actions/index.js';
import mutations from './mutations/index.js';
import * as getters from './getters/index.js';

Vue.use(Vuex);

const state = {
  currentRoute: '/',
  count: 0,
  rootPath: '',
  rootPan: '',
  consoleList: [],
  config: {
    port: '9800', //端口
    startPath: '/pages/default/index.html', //默认启动页
    outName: '-dist'
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: process.env.NODE_ENV !== 'pro'
    ? [createLogger()]
    : []
});
