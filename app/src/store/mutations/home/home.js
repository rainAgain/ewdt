export const GET_ROOT = (state, data) => {
  state.rootPath = data.rootPath;
  state.rootPan = data.rootPan;
};

export const CONSOLE_LOG = (state, data) => {
	const list = state.consoleList;
	// if(list.length == 4) {
	// 	list.shift();
	// }
	list.push(data);
  	state.consoleList = list;
};

export const CLEAN_CONSOLE = (state, data) => {
  	state.consoleList = [];
};