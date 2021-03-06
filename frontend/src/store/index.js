import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import config from './../../.env.json';

Vue.use(Vuex);
axios.defaults.baseURL = config.backend_address;

export default new Vuex.Store({
	state:
	{
		user: null,
		access_token: window.sessionStorage.getItem('access_token', null),
		refresh_token: window.sessionStorage.getItem('refresh_token'),
	},

	getters: 
	{
		loggedIn(state)
		{
			return state.access_token != null;
		},
	},

	mutations:
	{
		updateAccessToken(state, access_token)
		{
			state.access_token = access_token
		},

		deleteAccessToken(state)
		{
			state.access_token = null
		},

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

			commit('updateAccessToken', response.data.access_token)
		},

		logout({commit})
		{
			window.sessionStorage.removeItem("access_token");
			window.sessionStorage.removeItem("refresh_token");
			commit('deleteAccessToken')
			commit("updateAuthUser", null);
		},

		async fetchAuthUser({commit})
		{
			axios.defaults.headers.common["Authorization"] = "Bearer " + this.state.access_token;
			var response = await axios.get("users/auth/");

			commit("updateAuthUser", response.data);
		},

		async fetchActivities(context, data)
		{
			return await axios.get('activities/area/?latitude=' + data.latitude + '&longitude=' + data.longitude + '&radius=' + data.radius);
		},

		async fetchActivity(context, data)
		{
			return await axios.get('activities/' + data.id + '/');
		},

		async fetchUserActivities()
		{
			axios.defaults.headers.common["Authorization"] = "Bearer " + this.state.access_token;
			return await axios.get('activities/user');
		},

		async fetchActivityTags(context, data)
		{
			return await axios.get('activities/types/?id=' + data.id);
		},

		async fetchActivityRatings(context, data)
		{
			return await axios.get('activities/ratings/?id=' + data.id);
		},

		async fetchUserRatings()
		{
			return await axios.get('ratings/user');
		},

		async fetchUser(context, data)
		{
			return await axios.get('users/' + data.id + '/');
		},

		async fetchTags()
		{
			return await axios.get('types/');
		},

		async createActivity(context, data)
		{	
			const formData = new FormData();
			formData.append('creator', data.creator)
			formData.append('name', data.name);
			formData.append('description', data.description);
			formData.append('image', data.image);
			formData.append('longitude', data.longitude);
			formData.append('latitude', data.latitude);
			formData.append('website', data.website);

			data.tags.forEach(element => {
				formData.append("types", element)
			});

			axios.defaults.headers.common["Authorization"] = "Bearer " + this.state.access_token;
			var response = await axios.post('activities/', formData)
			return response
		},

		async createRating(context, data)
		{
			await axios.post('ratings/', {
				'activity': data.activity,
				'creator': data.creator,
				'note': data.note,
				'comment': data.comment,
			})
		},

		async updateRating(context, data)
		{
			await axios.patch('ratings/' + data.id + '/', {
				'activity': data.activity,
				'creator': data.creator,
				'note': data.note,
				'comment': data.comment,
			})
		},

		async deleteRating(context, data)
		{
			await axios.delete('ratings/' + data.id + '/')
		},

		async deleteActivity(context, data)
		{
			await axios.delete('activities/' + data.id + '/')
		},

		async updateActivity(context, data)
		{
			const formData = new FormData();
			formData.append('creator', data.creator)
			formData.append('name', data.name);
			formData.append('description', data.description);
			formData.append('image', data.image);
			formData.append('longitude', data.longitude);
			formData.append('latitude', data.latitude);
			formData.append('website', data.website);
			
			data.tags.forEach(element => {
				formData.append("types", element)
			});

			return await axios.patch('activities/' + data.id + '/', formData)
		},
	},
	modules: {},
});
