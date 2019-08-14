module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue'
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
  filenameHashing: false,
  outputDir: '../src/assetbundles/coachmarks/dist',
  devServer: {
    https: false,
    public: 'http://localhost:8080/',
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true
  }
};
