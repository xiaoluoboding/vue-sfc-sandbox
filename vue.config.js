const path = require('path')
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
      .test(/srcdoc\.html$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
  configureWebpack: {
    externals: {
      consolidate: 'Consolidate'
    }
  }
}
