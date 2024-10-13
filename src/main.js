import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import "primeicons/primeicons.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import router from './router'
import { createApp } from 'vue'
import App from './App.vue'

import ToastService from 'primevue/toastservice'
import Lara from '@primevue/themes/lara'
import store from './store'
import DialogService from 'primevue/dialogservice'

// primevue
import PrimeVue from 'primevue/config'
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Toolbar from 'primevue/toolbar';
import SelectButton from 'primevue/selectbutton';

import Tooltip from 'primevue/tooltip';
import { QuillEditor } from '@vueup/vue-quill';


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
    preset: Lara
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

app.component('Button', Button);
app.component('ToggleButton', ToggleButton);
app.component('Toolbar', Toolbar);
app.component('SelectButton', SelectButton);
app.directive('tooltip', Tooltip);
app.component('QuillEditor', QuillEditor);
/**
 * Mounts the Vue application to the DOM.
 * @param {string} selector - The CSS selector for the mount point.
 */
app.mount('#app')
