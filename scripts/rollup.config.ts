import path from 'path'

import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'
// import analyzer from 'rollup-plugin-analyzer'
import vue from 'rollup-plugin-vue'
import builtins from 'rollup-plugin-node-builtins'

import autoprefixer from 'autoprefixer'

import pkg from '../package.json'
import { activePackages } from './packages'

interface IOutput {
  format: string;
  name: string;
  isMinify: boolean;
  display?: string;
  globals?: Record<string, string>;
  plugins?: Array<any>;
}

const onwarn = (warning, rollupWarn) => {
  const ignoredWarnings = [
    {
      ignoredCode: 'CIRCULAR_DEPENDENCY',
      ignoredPath: './src'
    }
  ]

  // only show warning when code and path don't match
  // anything in above list of ignored warnings
  if (!ignoredWarnings.some(({ ignoredCode, ignoredPath }) => (
    warning.code === ignoredCode &&
    warning.importer && warning.importer.includes(path.normalize(ignoredPath))))
  ) {
    rollupWarn(warning)
  }
}

const configs = []

const appPlugins = [
  vue(),
  postcss({
    minimize: true,
    plugins: [autoprefixer()]
  }),
  html({
    include: '**/*.html'
  })
]
const nodePlugins = [
  resolve({
    preferBuiltins: false,
    browser: true
  }),
  commonjs(),
  builtins()
]

const minifyPlugins = [
  terser({
    format: {
      comments: false
    },
    compress: {
      drop_console: true
    }
  })
]

const createOutputs = (arg: IOutput) => {
  const {
    format,
    name,
    isMinify,
    globals = {},
    plugins = []
  } = arg

  let umdSettings = {}

  if (format === 'umd') {
    umdSettings = {
      globals: {
        vue: 'Vue',
        ...globals
      },
      name
    }
  }

  const fileType = isMinify ? format + '.min' : format === 'es' ? 'esm' : format

  const makeBanner = (name: string) => {
    return `/*!
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} xiaoluoboding
 * @license MIT
 */`
  }

  return {
    banner: makeBanner(name),
    file: `lib/${name}.${fileType}.js`,
    format,
    ...umdSettings,
    plugins
  }
}

function createEntry (config: any, external: any) {
  return {
    input: 'packages/index.ts',
    onwarn,
    output: [
      createOutputs(config)
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false
          }
        }
      }),
      replace({
        preventAssignment: true,
        __DEV__: config.format !== 'umd'
          ? '(process.env.NODE_ENV !== "production")'
          : config.isMinify ? 'false' : 'true'
      }),
      filesize(),
      // analyzer(),
      ...appPlugins,
      ...nodePlugins
    ],
    external: [
      'vue',
      ...external
    ]
  }
}

for (const { name, display, external = [], globals = {} } of activePackages) {
  // build lib cjs/esm/umd/umd.min js
  const configMap = [
    { format: 'cjs', name, isMinify: false },
    { format: 'es', name, isMinify: false },
    { format: 'umd', name, isMinify: false, display, globals },
    { format: 'umd', name, isMinify: true, display, globals, plugins: minifyPlugins }
  ]

  configMap.map((conf) => configs.push(createEntry(conf, external)))

  // build lib d.ts
  configs.push({
    input: 'packages/index.ts',
    output: {
      file: `lib/${pkg.name}.d.ts`,
      format: 'es'
    },
    plugins: [
      dts(),
      typescript(),
      vue(),
      ...appPlugins,
      ...nodePlugins
    ]
  })
}

export default configs
