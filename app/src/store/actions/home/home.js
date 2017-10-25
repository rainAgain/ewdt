export const getRoot = ({ commit }, data) => {
  commit('GET_ROOT', data);
};

export const consoleLog = ({ commit }, data) => {
  commit('CONSOLE_LOG', data);
};

export const cleanConsole = ({ commit }, data) => {
  commit('CLEAN_CONSOLE', data);
};

//保存配置
export const saveConfig = ({ commit }, data) => {
  commit('SAVE_CONFIG', data);
};