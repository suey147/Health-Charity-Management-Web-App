import { createStore} from 'vuex'

const authState = createStore({
    state:{
        isAuthenticated: false,
        role: null,
        details: {}
    },
    mutations:{
        setAuthenticated(state, payload){
            state.isAuthenticated = payload.isAuthenticated;
            state.role = payload.user.role;
            state.details = payload.user;
        },
        clearAuthState(state){
            state.isAuthenticated = false;
            state.role = null;
            state.details = {};
        }
    },
    getters:{
        isAuthenticated(state){return state.isAuthenticated},
        userRole(state){return state.role},
        userDetails(state){return state.details},
    }
});

export default authState;