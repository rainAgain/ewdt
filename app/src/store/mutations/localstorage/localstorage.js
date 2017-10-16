export const SET_ITEM = (state, data) => {
  localStorage.setItem(data.name, data.value);
};



export const REMOVE_ITEM = (state, data) => {
  localStorage.removeItem(data);
};
