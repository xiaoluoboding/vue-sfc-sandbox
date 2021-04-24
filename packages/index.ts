import { App } from 'vue'

import SfcSandbox from './sandbox/index.vue'
import SplitPane from './components/SplitPane.vue'
import LoadingMask from './components/LoadingMask.vue'

const install = (app: App): void => {
  app.component('SfcSandbox', SfcSandbox)
  app.component('SplitPane', SplitPane)
  app.component('LoadingMask', LoadingMask)
}

export {
  SfcSandbox,
  SplitPane
}

export default install
