/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.html'

declare module '*.types' {
  const content: string;
  export default content;
}

declare module '*.d.ts' {
  const content: string;
  export default content;
}

