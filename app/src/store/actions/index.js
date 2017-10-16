import * as example from './example/example.js';
import * as home from './home/home.js';
import * as fetchApi from './fetchApi.js';
import * as localstorage from './localstorage/localstorage.js';

export default {
  ...home,
  ...fetchApi,
  ...example,
  ...localstorage
};