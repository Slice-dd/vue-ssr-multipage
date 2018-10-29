const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const readFile = (fs, file, index) => {
  try {
    return fs.readFileSync(path.join(clientConfig[index].output.path, file), 'utf-8')
  } catch (e) {}
}

module.exports = function setupDevServer (entry, index, app, templatePath, cb) {

  let bundle
  let template
  let clientManifest

  let ready
  const readyPromise = new Promise(r => { ready = r })
  const update = () => {
    if (bundle && clientManifest) {
      ready()
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }
  
  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('index.html template updated.')
    update()
  })

  const HMRPath = '/__webpack_hmr_' + entry
  
  // modify client config to work with hot middleware
  clientConfig[index].entry[entry] = [`webpack-hot-middleware/client?&name=${entry}&path=${HMRPath}`, clientConfig[index].entry[[entry]]]
  clientConfig[index].output.filename = '[name].[hash].js'
  clientConfig[index].plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware 
  const clientCompiler = webpack(clientConfig[index])
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig[index].output.publicPath,
    noInfo: true
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      `${entry}-ssr-client-manifest.json`,
      index
    ))
    update()
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000, path: HMRPath }))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig[index])
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, `${entry}-ssr-server-bundle.json`, index))
    update()
  })

  return readyPromise
}
