const manifestJSON = require('./public/manifest');
const args = process.argv;

module.exports = {

    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/scss/_main.scss";
                `
            }
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 3006,
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
        manifestPath: 'manifest.json'
    }

};
