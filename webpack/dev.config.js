import webpack from 'webpack'
import { merge } from 'lodash'
import webpackConfig from './webpack.config'
import config from '../config'
import path from 'path'
//
import Dashboard from 'webpack-dashboard'
import DashboardPlugin from 'webpack-dashboard/plugin'
const dashboard = new Dashboard()
//
const node_modules_dir = path.resolve(__dirname, '../node_modules')
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const {webpackDevServer: {host, port}} = config
const {browserSyncServer: {bSyncHost, bSyncPort}} = config

const webpackDevServerUrl = `http://${host}:${port}`
let clientConfig = merge({}, webpackConfig, {
  devtool: 'cheap-eval-source-map',
  debug: true,
  devServer: {
    quiet: true, // add
    historyApiFallback: true,
    noInfo: true
  }
})

clientConfig.entry.main = [
  `webpack-dev-server/client?${webpackDevServerUrl}`,
  'webpack/hot/only-dev-server',
  clientConfig.entry.main
]

clientConfig.plugins.push(
  //new DashboardPlugin(dashboard.setData),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.ProgressPlugin(function (percentage, message) {
    var MOVE_LEFT = new Buffer('1b5b3130303044', 'hex').toString()
    var CLEAR_LINE = new Buffer('1b5b304b', 'hex').toString()
    process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + '% :' + message + MOVE_LEFT)
  })
  //new BrowserSyncPlugin({
  //  host: bSyncHost,
  //  port: bSyncPort,
  //  server: {baseDir: [webpackConfig.output.publicPath]}
  //})
)

clientConfig.module.loaders[0].loaders.unshift('react-hot-loader/webpack')

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
    preLoaders: [
      {test: /\.jsx?$/, loader: 'eslint-loader', exclude: [node_modules_dir]},
      {test: /\.js$/, loader: 'eslint-loader', exclude: [node_modules_dir]}
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.js$/, // include .js files
        loaders: ['babel-loader'],
        exclude: [node_modules_dir]
      }
    ]
  },

  target: 'node',

  plugins: [],

  node: {},

  devtool: 'source-map'
})

serverConfig.output.path = serverConfig.output.path + '/server'

export default clientConfig

