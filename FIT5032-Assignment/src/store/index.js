import { createStore } from 'vuex'

const authState = createStore({
    state:{
        isAuthenticated: false,
        role: null,
        details: null
    },
    mutations:{
        setAuthenticated(state, payload){
            state.isAuthenticated = payload.isAuthenticated;
            state.role = payload.user.role;
            state.details = payload.user;
        }
    },
    getters:{
        isAuthenticated: state => state.isAuthenticated,
        userRole: (state) => state.role,
        userDetails: (state) => state.details,
        isAdmin: (state) => state.role === 'admin',
        isUser: (state) => state.role === 'user',
    }
});

export default authState;