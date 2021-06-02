const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)

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
      .test(/(srcdoc\.html$|\.types$)/i)
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
