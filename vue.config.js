const WebappWebpackPlugin = require('webapp-webpack-plugin');
const vueThreadLoader = require('vue-thread-loader');
const manifestJSON = require('./public/manifest');
const args = process.argv;

module.exports = {

    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/scss/_main.scss";'
            }
        }
    },

    configureWebpack(config) {
        config.plugins.push(new WebappWebpackPlugin('./src/assets/favicon.png'));
        vueThreadLoader()(config);
    },

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
        msTileColor: '#f5f6fa',
        manifestPath: 'manifest.json',
        workboxPluginMode: 'GenerateSW'
    }
};
