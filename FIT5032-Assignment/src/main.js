import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import store from './store'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router)
app.use(store)
app.mount('#app')
