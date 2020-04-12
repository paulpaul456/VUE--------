module.exports = {
    chainWebpack: config => {
        // 發布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')//發布模式走這支JS
            config.set('externals', {//代表這些套件直接用CDN掛載 不是用NPM安裝的
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nporgress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor',
                moment: 'moment'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 開發模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')//開發模式走這支JS
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}
