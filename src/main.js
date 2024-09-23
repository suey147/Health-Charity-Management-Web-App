import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'mapbox-gl/dist/mapbox-gl.css';

import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
import store from './store'
import DialogService from 'primevue/dialogservice'

/**
 * Initializes and mounts the Vue application.
 */
const app = createApp(App)

/**
 * Configures PrimeVue with a custom theme.
 * @param {Object} PrimeVue - The PrimeVue plugin.
 * @param {Object} options.theme - Theme settings for PrimeVue.
 */
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

/**
 * Configures the ToastService plugin.
 * @param {Object} ToastService - The ToastService plugin.
 */
app.use(ToastService)

/**
 * Configures the router.
 * @param {Object} router - The Vue Router instance.
 */
app.use(router)

/**
 * Configures the Vuex store.
 * @param {Object} store - The Vuex store instance.
 */
app.use(store)

/**
 * Configures the DialogService plugin.
 * @param {Object} DialogService - The DialogService plugin.
 */
app.use(DialogService)

/**
 * Mounts the Vue application to the DOM.
 * @param {string} selector - The CSS selector for the mount point.
 */
app.mount('#app')
