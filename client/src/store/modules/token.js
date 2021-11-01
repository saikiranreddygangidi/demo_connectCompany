import Vue from "vue";
import _ from "lodash";
import axios from "axios";

// axios.defaults.baseURL = process.env.API_BASE_URL;
axios.defaults.baseURL = "https://connectcompanyapi.herokuapp.com/connectcompany/api/v1";

const state = {
  token: sessionStorage.getItem("access_token") || null,
  userDetails: localStorage.getItem("user_details")
    ? JSON.parse(localStorage.getItem("user_details"))
    : null,
};
//getters
const getters = {
  loggedIn: (state) => {
    return state.token !== null;
  },
  userDetails: (state) => {
    return state.userDetails;
  },
};
//mutation 
const mutations = {
  saveUserAuth: (state, payload) => {
    // console.log(payload,"-----------payload")
    state.token = payload.token;
    state.userDetails = payload.userDetails;
  },
  destroyUserAuth: (state) => {
    state.token = null;
    state.userDetails = null;
  },
};
//action 
const actions = {
  retrieveToken: (context, credentials) => {
    return new Promise((resolve, reject) => {
      axios
        .post("auth/login", credentials)
        .then((response) => {
          const token = response.data.token;
          Vue.prototype.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + token;
          let userDetails = _.omit(response.data, [
            "token",
            "status",
            "message",
          ]);

          sessionStorage.setItem("access_token", "Bearer " + token);
          localStorage.setItem("user_details", JSON.stringify(userDetails));

          context.commit("saveUserAuth", {token, userDetails});
          resolve(response);
        })
        .catch((error) => {
          sessionStorage.removeItem("access_token");
          localStorage.removeItem("user_details");
          reject(error);
        });
    });
  },

  destroyToken({commit}) {
    return new Promise((resolve) =>{
      commit('destroyUserAuth')
      console.log("--------------destroy token")
      sessionStorage.removeItem("access_token");
      localStorage.removeItem("user_details");
      resolve()
    })
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
