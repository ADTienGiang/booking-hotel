// store/search.js
export const state = () => ({
    searchData: null,
  });
  
  export const mutations = {
    setSearchData(state, data) {
      state.searchData = data;
    },
  };
  