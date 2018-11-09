import { userService } from '../_services';
import { router } from '../_helpers';
import {JSO} from 'jso'

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true }, user }
    : { status: {}, user: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });
    
        userService.login(username, password)
            .then(
                user => {
                    commit('loginSuccess', user);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
    register({ dispatch, commit }, user) {
        commit('registerRequest', user);
    
        userService.register(user)
            .then(
                user => {
                    commit('registerSuccess', user);
                    router.push('/login');
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('alert/success', 'Registration successful', { root: true });
                    })
                },
                error => {
                    commit('registerFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    Oauth2() {
        let client = new JSO({
            response_type: 'code',
            providerID: 'google',
            client_id: '1053680205939-2lk9e9ijv5r866icscil8duoai0tustb.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:8080/account', // The URL where you is redirected back, and where you perform run the callback() function.
            authorization: 'https://accounts.google.com/o/oauth2/auth',
            scopes: {request: ['https://www.googleapis.com/auth/drive.metadata.readonly']},
            debug: true
          });
        let opts = {
        response_type: 'code',
        redirect_uri: 'http://localhost:8080/account'
        }
        client.getToken(opts)
    }
};

const mutations = {
    loginRequest(state, user) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = { loggedIn: true };
        state.user = user;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state, user) {
        state.status = { registering: true };
    },
    registerSuccess(state, user) {
        state.status = {};
    },
    registerFailure(state, error) {
        state.status = {};
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};