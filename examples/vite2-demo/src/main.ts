import { createApp } from 'vue'
import App from './App.vue'

import VueSfcSandbox from '../plugins/vue-sfc-sandbox.esm'

createApp(App)
  .use(VueSfcSandbox)
  .mount('#app')
