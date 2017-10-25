require('es6-promise').polyfill();
require('isomorphic-fetch');
var logger = global.elRequire('tracer').console({
					format : "[{{timestamp}}] {{message}}",
					dateformat : "HH:MM:ss.L"
				});

require('./config/menu.js');


import 'lib-flexible';
import Vue from 'vue';

import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS

import App from './App.vue';
import VueRouter from 'vue-router';
import store from './store/index.js';
import routes from './config/router-config';
import FastClick from 'fastclick';
import scriptjs from 'scriptjs';

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

//Vue.use(ElementUI)
Vue.use(iView);

Vue.use(VueRouter)

Vue.use({
  install (Vue, options) {
      //添加实例方法
      Vue.prototype.$logger = logger;
  }
});

const router = new VueRouter({
  mode: 'hash',
  routes
});

new Vue({
  el: '#applicaton',
  store,
  router,
  render: h => h(App)
})
