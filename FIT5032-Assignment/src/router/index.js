import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
// create routes
const routes = [
    
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: {requiresAuth: true}
    },
    
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router