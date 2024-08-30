import { createRouter, createWebHistory } from 'vue-router';
import authState from '@/store';
// Homw
import HomeView from '../views/HomeView.vue';

// About
import AboutUsView from '@/views/About/AboutUsView.vue';
import ContactUsView from '@/views/About/ContactUsView.vue';
import DonationView from '@/views/About/DonationView.vue';
import OurTeamView from '@/views/About/OurTeamView.vue';

// Supports
import ForumView from '@/views/Supports/ForumView.vue';
import SupportGroupView from '@/views/Supports/SupportGroupView.vue';
import EventView from '@/views/Supports/EventView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import RegisterView from '@/views/Auth/RegisterView.vue';

// KnowledgeHub
import DocumentView from '@/views/knowledgeHub/DocumentView.vue';
import KnowledgeHubView from '@/views/knowledgeHub/KHView.vue';
import EditKnowledgeHub from '@/views/knowledgeHub/KHEdit.vue';
import AccessRequired from '@/views/knowledgeHub/AccessRequired.vue';
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
            },
            {
                path: 'donate',
                name: 'Donate',
                component: DonationView,
            }
        ]
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
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    // check authentication
    const isAuthenticated = authState.getters.isAuthenticated;
    const userRole = authState.getters.userRole;

    // check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated){
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
        return {
            // Todo: redirect to not authorized page
            path: '/login'
        }
    }
})

export default router