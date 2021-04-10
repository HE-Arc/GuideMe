import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import config from './../../.env.json';

Vue.use(Vuex);
axios.defaults.baseURL = "http://localhost:8000/api/";

export default new Vuex.Store({
	state:
	{
		activities: [],
		user: null,
		access_token: window.sessionStorage.getItem('access_token'),
		refresh_token: window.sessionStorage.getItem('refresh_token'),
	},

	mutations:
	{
		updateAuthUser(state, user)
		{
            state.user = user;
        },
	},

	actions: {
		async register(context, data)
		{
			return axios.post("users/", {
				username: data.name,
				email: data.email,
				password: data.password,
			})
		},

		async login({commit}, data)
		{
			var bodyFormData = new FormData();
            bodyFormData.append("grant_type", "password");
            bodyFormData.append("client_id", config.client_id);
            bodyFormData.append("client_secret", config.client_secret);
            bodyFormData.append("username", data.username);
            bodyFormData.append("password", data.password);

			var response = await axios.post("login/token/", bodyFormData);
			window.sessionStorage.setItem("access_token", response.data.access_token);
			window.sessionStorage.setItem("refresh_token", response.data.refresh_token);

			axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.access_token;
			response = await axios.get("users/auth/");

			commit("updateAuthUser", response.data);
		},

		logout({commit})
		{
			window.sessionStorage.removeItem("access_token");
			window.sessionStorage.removeItem("refresh_token");
			commit("updateAuthUser", null);
		},
	},
	modules: {},
});
