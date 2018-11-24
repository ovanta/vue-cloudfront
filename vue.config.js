module.exports = {

    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/scss/_variables.scss";
                    @import "@/scss/_mixins.scss";
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
        themeColor: '#673AB7',
        msTileColor: '#F5F6FA',
        manifestPath: 'manifest.json',
        workboxPluginMode: 'GenerateSW'
    }

};
