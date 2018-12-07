const manifestJSON = require('./public/manifest');

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

    pwa: {
        themeColor: manifestJSON.theme_color,
        msTileColor: '#F5F6FA',
        manifestPath: 'manifest.json'
    }

};
