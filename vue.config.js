module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.html$/)
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
