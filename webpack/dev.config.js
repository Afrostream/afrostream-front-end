import webpack from 'webpack'
import merge from 'lodash/object/merge'
import webpackConfig from './webpack.config'
import config from '../config'

// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const {webpackDevServer: {host, port}} = config
const {browserSyncServer: {bSyncHost, bSyncPort}} = config
var webpackDevServerUrl = `http://${host}:${port}`
const devConfig = merge({}, webpackConfig, {
  devtool: 'eval-source-map',
  debug: true
})

devConfig.entry.main = [
  `webpack-dev-server/client?${webpackDevServerUrl}`,
  'webpack/hot/only-dev-server',
  devConfig.entry.main
]

devConfig.plugins.push(
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

devConfig.module.loaders[0].loaders.unshift('react-hot')

export default devConfig
