import { createStore} from 'vuex'
/**
 * Vuex store for authentication state management.
 * @type {Object}
 */
const authState = createStore({
    state:{

        //Indicates if the user is authenticated.
        isAuthenticated: false,
        //Role of the authenticated user.
        role: null,
        //current user id 
        currentUser: null
    },
    mutations:{
        /**
         * Sets the authentication state.
         * @function setAuthenticated
         * @param {Object} state - The current state.
         * @param {Object} payload - The payload containing authentication details.
         * @param {boolean} payload.isAuthenticated - Indicates if the user is authenticated.
         * @param {Object} payload.user - The authenticated user details.
         * @param {string} payload.user.role - The role of the authenticated user.
         */
        setAuthenticated(state, payload){
            state.isAuthenticated = payload.isAuthenticated;
            state.role = payload.role;
            state.currentUser = payload.currentUser;
            sessionStorage.setItem("isLoggedIn", state.isAuthenticated);
            sessionStorage.setItem("role", state.role );
            sessionStorage.setItem("currentUser", state.currentUser);
        },
        /**
         * Clears the authentication state.
         * @function clearAuthState
         * @param {Object} state - The current state.
         */
        clearAuthState(state){
            state.isAuthenticated = false;
            state.role = null;
            state.currentUser = null;
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("currentUser");
        }
    },
    getters:{
        /**
         * Gets the authentication status.
         * @returns {boolean} The authentication status.
         */
        isAuthenticated(){
            return sessionStorage.getItem("isLoggedIn");
        },
        /**
         * Gets the role of the authenticated user.
         * @param {Object} state - The current state.
         * @returns {string|null} The role of the authenticated user.
         */
        userRole(){
            return sessionStorage.getItem("role");
        },
        /**
         * Gets the details of the authenticated user.
         * @param {Object} state - The current state.
         * @returns {Object} The details of the authenticated user.
         */
        currentUser(){
            return sessionStorage.getItem("currentUser");
        },
        /**
         * Checks if the authenticated user is an admin.
         * @param {Object} state - The current state.
         * @returns {boolean} True if the user is an admin, false otherwise.
         */
        isAdmin(state){return state.role == 'admin'}
    }
});

export default authState;