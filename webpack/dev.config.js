import webpack from 'webpack'
import { merge } from 'lodash'
import webpackConfig from './webpack.config'
import config from '../config'
import path from 'path'
//
//import DashboardPlugin from 'webpack-dashboard/plugin'
//import Dashboard from 'webpack-dashboard'
//const dashboard = new Dashboard()
//
const nodeModulesPath = path.resolve(__dirname, '../node_modules')
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const {webpackDevServer: {host, port}} = config
const {browserSyncServer: {bSyncHost, bSyncPort}} = config

const webpackDevServerUrl = `http://${host}:${port}`
let clientConfig = merge({}, webpackConfig, {
  devServer: {
    // putain de webpack: disabling security check.
    disableHostCheck: true,
    //
    historyApiFallback: true,
    compress: false,
    inline: true,
    hot: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
})

clientConfig.entry.main = [
  //`react-dev-utils/webpackHotDevClient`,
  `webpack-dev-server/client?${webpackDevServerUrl}`,
  'webpack/hot/only-dev-server',
  clientConfig.entry.main
]

clientConfig.plugins.push(
  //new DashboardPlugin(dashboard.setData),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.ProgressPlugin(function (percentage, message) {
    if (percentage === 0) {
      console.log('')
      console.log('webpack: bundle build is started ... wait a moment ...')
    }
    if (percentage === 1) {
      console.log('')
      console.log('webpack: bundle build is now finished.')
    }
  })
  //new BrowserSyncPlugin({
  //  host: bSyncHost,
  //  port: bSyncPort,
  //  server: {baseDir: [webpackConfig.output.publicPath]}
  //})
)

clientConfig.module.rules[0].use.unshift('react-hot-loader')

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

let serverConfig = merge({}, webpackConfig, {
  entry: {
    server: './server'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: [nodeModulesPath],
      },
      {
        test: /\.(js|jsx)$/,
        use: 'eslint-loader',
        enforce: 'pre',
        exclude: [nodeModulesPath]
      }
    ]
  },

  target: 'node',

  plugins: [],

  node: {}
})

serverConfig.output.path = serverConfig.output.path + '/server'

export default clientConfig
