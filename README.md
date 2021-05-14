# Vue SFC Sandbox

> Vue SFC Sandbox built on top of `@vue/compiler-sfc`, Sandbox as a Vue 3 component.

## 🖼️ Preivew

![preview](./preview.png)

## ✨ Features

### 🗳️ Sandbox

* 💪 Fully Typed
* 📁 Virtual File System (Support Compile `.vue/.js` File). based on [vue-sfc2esm](https://github.com/xiaoluoboding/vue-sfc2esm)
* 👬 Friendly Error Tips. based on [vue-sfc2esm](https://github.com/xiaoluoboding/vue-sfc2esm)
* 🧪 Transpiled SFC File to ES Modules.
* 🔌 Support Externals CDN, like [unpkg](https://unpkg.com/)、[jsdelivr](https://www.jsdelivr.com/) etc.
* 🧩 Load [Import Maps](https://github.com/WICG/import-maps) as ES Modules.

### ✏️ Editor Panel

* 🎨 Themeable Editor based on [codemirror 6](https://codemirror.net/6/)
* 🧑‍💻 Developer Friendly, built-in syntax highlighting, REPL Sandbox with Split Panes

### 👓 Preview Panel

* ⚡️ Runtime Compile SFC File
* 🔍 Fullscreen View

## 💡 Inspiration

This project is heavily inspired by [Vue SFC Playground](https://github.com/vuejs/vue-next/tree/master/packages/sfc-playground). Actually Copied from it.

## 📦 Installation

```bash
yarn add vue-sfc-sandbox -S
or
npm i vue-sfc-sandbox -S
```

## 📖 Usage

> Notice that `vue-sfc-sandbox` is depending on `@vue/compiler-sfc`, and `@vue/compiler-sfc` depending on `Consolidate` packages.
> We need configure `Consolidate` as externals in `vue.config.js` file.

### Demos

Vue 3 Demo: [Vue CLI 3.x](./examples/vue3-demo/README.md)

### Vue 3

```js
// vue.config.js in vue 3 project
module.exports = {
  ...
  configureWebpack: {
    externals: {
      consolidate: 'Consolidate'
    }
  }
  ...
}
```

**Use SFC Sandbox Component**

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

import VueSfcSandbox from 'vue-sfc-sandbox'

createApp(App)
  .use(VueSfcSandbox)
  .mount('#app')
```

**In component**

```vue
<template>
  <!-- [ESM] default case -->
  <sfc-sandbox v-bind="defaultAttrs" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',

  setup () {
    const defaultAttrs = {
      height: 200,
      sfcFilename: 'DefaultDemo.vue',
      sfcCode: `<template>
  <h1>{{ msg }}</h1>
</template>

<script setup>
const msg = 'Hello World!'
</script>
`
    }

    return {
      defaultAttrs
    }
  }
})
</script>
```

## Props

| Attribute | Description | Type | Accepted values | Default |
|:--------:|--------|--------|:--------:|:--------:|
| height | the sandbox height unit (px) | Number | - | 400 |
| import-maps | specify a import maps in the `<script>` element include `type=\"importmap\"` | String | - | - |
| externals | specify some cdn like jsdelivr、unpkg | String | - | - |
| sfc-filename | virtual sfc filename like `HelloWorld.vue` | - | - |
| sfc-code | transpile sfc code to es modules by `vue-sfc2esm` | String | - | - |

## 💻 Development

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

### Compiles and minifies for production

```bash
yarn build
```

### Lints and fixes files

```bash
yarn lint
```

## 🗃️ Similar Repos

* [vuep](https://github.com/QingWei-Li/vuep) - 🎡 A component for rendering Vue components with live editor and preview.
* [codepan](https://github.com/egoist/codepan) - Like codepen and jsbin but works offline.
* [demosify](https://github.com/demosify/demosify) - Create a playground to show the demos of your projects.

## 📄 License

MIT [@xiaoluoboding](https://github.com/xiaoluoboding)
