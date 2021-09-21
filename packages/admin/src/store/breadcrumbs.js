export default {
  namespaced: true,
  state: {
    items: null,
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
  },
};
