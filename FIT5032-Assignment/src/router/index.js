import { createRouter, createWebHistory } from 'vue-router';
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
import KnowledgeHubView from '@/views/KnowledgeHubView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import RegisterView from '@/views/Auth/RegisterView.vue';


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
        name: 'Knowledge-Hub',
        component: KnowledgeHubView,
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


export default router