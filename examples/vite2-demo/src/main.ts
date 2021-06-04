import { createApp } from 'vue'
import App from './App.vue'

import VueSfcSandbox from 'vue-sfc-sandbox'

createApp(App)
  .use(VueSfcSandbox)
  .mount('#app')
