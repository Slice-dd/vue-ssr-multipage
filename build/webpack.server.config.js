const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const entryPath = require('./entryConfig.js')

const entrys = entryPath('server')

const serverPlugin = Object.keys(entrys).map(entry => {
  return merge(base, {
    target: 'node',
    devtool: 'source-map',
    entry: entrys[entry],
    output: {
      libraryTarget: 'commonjs2'
    },
    resolve: {
      alias: {
        // 'create-api': './create-api-server.js'
      }
    },
    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    externals: nodeExternals({
      // do not externalize CSS files in case we need to import it from a dep
      whitelist: /\.css$/
    }),
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"server"'
      }),
      new VueSSRServerPlugin({
        filename: `${entry}-ssr-server-bundle.json`
      })
    ]
  })

})


module.exports = serverPlugin
