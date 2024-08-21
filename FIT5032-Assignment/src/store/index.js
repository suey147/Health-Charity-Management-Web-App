import { createStore } from 'vuex'

const authState = createStore({
    state:{
        isAuthenticated: false,
        role: null
    },
    mutations:{
        setAuthenticated(state, payload){
            state.isAuthenticated = payload.isAuthenticated;
            state.role = payload.role;
        }
    },
    getters:{
        isAuthenticated: state => state.isAuthenticated,
        userRole: (state) => state.role,
        isAdmin: (state) => state.role === 'admin',
        isUser: (state) => state.role === 'user',
    }
});

export default authState;