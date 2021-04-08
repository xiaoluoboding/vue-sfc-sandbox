module.exports = {
  publicPath: './',
  chainWebpack: config => {
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
