import { createRouter, createWebHistory } from 'vue-router';
import authState from '@/store';
// Homw
import HomeView from '../views/HomeView.vue';

// About
import AboutUsView from '@/views/About/AboutUsView.vue';
import ContactUsView from '@/views/About/ContactUsView.vue';
import DonationView from '@/views/About/DonationView.vue';
import OurTeamView from '@/views/About/OurTeamView.vue';
import DonationPaymenView from '@/views/About/DonationPaymenView.vue';

// Supports
import ForumView from '@/views/Supports/ForumView.vue';
import SupportGroupView from '@/views/Supports/SupportGroupView.vue';
import EventView from '@/views/Supports/EventView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import RegisterView from '@/views/Auth/RegisterView.vue';

// KnowledgeHub
import DocumentView from '@/views/knowledgeHub/DocumentView.vue';
import KnowledgeHubView from '@/views/knowledgeHub/KHView.vue';
import EditKnowledgeHub from '@/views/knowledgeHub/edit/KHEdit.vue';
import AccessRequired from '@/views/knowledgeHub/edit/AccessRequired.vue';

import AdminRequiredView from '@/views/AdminRequiredView.vue';

// create routes
const routes = [
    // Home section
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    // About section
    {
        path: '/about',
        name: 'About',
        children: [
            {
                path: 'about-us',
                name: 'About Us',
                component: AboutUsView,
            },
            {
                path: 'team',
                name: 'About Team',
                component: OurTeamView,
            },
            {
                path: 'contact-us',
                name: 'Contact Us',
                component: ContactUsView,
            }
        ]
    },
    //Donate
    {   
        path: '/donate',
        name: 'Donate',
        component: DonationView,
    },
    {
        path: '/payment',
        name: 'Payment',
        component: DonationPaymenView,
    },
    // Support section
    {
        path: '/supports',
        name: 'Supports',
        children: [
            {
                path: 'events',
                name: 'Events',
                component: EventView,
            },
            {
                path: 'forum',
                name: 'Forum',
                component: ForumView,
            },
            {
                path: 'support-groups',
                name: 'Support Groups',
                component: SupportGroupView,
            }
        ]
    },
    // Knowledge Hub
    {
        path: '/knowledge-hub',
        name: 'Knowledgehub',
        component: KnowledgeHubView,
    },
    {
        path: '/knowledge-hub/document/:id',
        name: 'DocumentPage',
        component: DocumentView,
        props: true,
        meta: {requiresAuth: true, requriesAdmin: false}
    },
    {
        path: '/knowledge-hub/edit',
        name: 'EditKnowledgeHub',
        component: EditKnowledgeHub,
        meta: {requiresAuth: true, requriesAdmin: true}
    },
    {
        path: '/knowledge-hub/access-required',
        name: 'KHAccessRequired',
        component: AccessRequired,
    },
    // Login
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    // Register
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/admin-required',
        name: 'AdminRequired',
        component: AdminRequiredView,
    },
]

/**
 * Vue Router instance.
 * @type {Object}
 */
const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * Navigation guard to check authentication and authorization before each route.
 * @param {Object} to - The target Route Object being navigated to.
 * @param {Object} from - The current route being navigated away from.
 * @returns {Object|undefined} The route to redirect to if authentication or authorization fails.
 */
router.beforeEach((to, from) => {
    // check authentication
    const isAuthenticated = authState.getters.isAuthenticated;
    const userRole = authState.getters.userRole;

    // check if route requires authentication
    console.log(isAuthenticated)
    if (to.meta.requiresAuth && !isAuthenticated){
        console.log("login required")
        if (to.path.startsWith('/knowledge-hub/document'))
        {
            return {
                path: '/knowledge-hub/access-required',
                query: { redirect: to.fullPath },
            }
        }
        return {
            path: '/login',
            query: { redirect: to.fullPath },
        }
    }

    // check if the route requries admin access
    if(to.meta.requriesAdmin && userRole !== 'admin'){
        console.log("Admin required")
        return {
            path: '/admin-required'
        }
    }
})

export default router