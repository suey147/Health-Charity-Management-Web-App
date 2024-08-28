import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import store from './store'
import firebaseApp from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(router)
app.use(store)
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
})
app.mount('#app')
