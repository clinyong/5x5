require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var bodyParser = require('body-parser')
var dateFormat = require('dateformat')
var fs = require('fs')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => { }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n')
})

const uploadsDir = path.resolve(__dirname, '../uploads')
app.use(bodyParser.json());
app.post('/api/upload', function (req, res) {
    var now = new Date();
    var fileName = dateFormat(now, "yyyy-mm-dd-HH-MM-ss")
    fs.writeFileSync(`${uploadsDir}/${fileName}.json`, JSON.stringify(req.body, null, '\t'), 'utf8')
    res.send('Upload successfully.');
});

app.post('/api/download', function (req, res) {
    const uploads = fs.readdirSync(uploadsDir).filter(name => name != '.DS_Store')
    const latest = uploads[uploads.length - 1]
    const settings = fs.readFileSync(`${uploadsDir}/${latest}`).toString()
    res.setHeader('Content-Type', 'application/json')
    res.send(settings);
});

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
})
