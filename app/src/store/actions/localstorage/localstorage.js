//存储localStorage
//使用 this.$store.dispatch('setItem',{name:'test',value: 'valuetest'}）

export const setItem = ({ commit }, data) => {
  commit('SET_ITEM', data);
};


//删除localStorage
//使用 this.$store.dispatch('removeItem','test'）

export const removeItem = ({ commit }, data) => {
  commit('REMOVE_ITEM', data);
};
