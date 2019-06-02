const manifestJSON = require('./public/manifest');
const args = process.argv;
const vueThreadLoader = require('vue-thread-loader');

module.exports = {

    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/scss/_main.scss";'
            }
        }
    },

    configureWebpack: vueThreadLoader(),

    devServer: {
        host: '0.0.0.0',
        port: 3000,
        hot: true,
        disableHostCheck: true
    },

    pluginOptions: {
        webpackBundleAnalyzer: {
            analyzerMode: args.includes('--analyze-bundle') ? 'static' : 'disabled',
            openAnalyzer: false
        }
    },

    pwa: {
        themeColor: manifestJSON.theme_color,
        msTileColor: '#F5F6FA',
        manifestPath: 'manifest.json',
        workboxPluginMode: 'GenerateSW'
    }
};
