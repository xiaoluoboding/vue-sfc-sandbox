const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  publicPath: './',
  pages: {
    index: {
      entry: resolve('app/main.ts')
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('app'))
    // load srcdoc.html only
    config.module
      .rule('raw')
      .test(/srcdoc\.html$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ],
    externals: {
      consolidate: 'Consolidate'
    }
  }
}
