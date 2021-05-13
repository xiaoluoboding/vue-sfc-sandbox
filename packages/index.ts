import { App } from 'vue'

import SfcSandbox from './sandbox/index.vue'

const install = (app: App): void => {
  app.component(SfcSandbox.name, SfcSandbox)
}

export { SfcSandbox }

export default install
