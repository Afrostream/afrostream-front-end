import webpack from 'webpack';
import merge from 'lodash/object/merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import webpackConfig from './webpack.config.js';
import config from '../config';
import herokuConfig from '../app.json';

// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const { webpackDevServer: { host, port } } = config;
const { browserSyncServer: { bSyncHost, bSyncPort } } = config;
var webpackDevServerUrl = `http://${host}:${port}`;
const devConfig = merge({}, webpackConfig, {
  devtool: 'eval-source-map',
  debug: true
});

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.API_END_POINT === herokuConfig.env.API_END_POINT) {
  delete herokuConfig.env.NODE_ENV;
  merge(process.env, herokuConfig.env);
}

devConfig.entry.main = [
  `webpack-dev-server/client?${webpackDevServerUrl}`,
  'webpack/hot/only-dev-server',
  devConfig.entry.main
];

devConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.ProgressPlugin(function (percentage, message) {
    var MOVE_LEFT = new Buffer('1b5b3130303044', 'hex').toString();
    var CLEAR_LINE = new Buffer('1b5b304b', 'hex').toString();
    process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + '% :' + message + MOVE_LEFT);
  })
  //new BrowserSyncPlugin({
  //  host: bSyncHost,
  //  port: bSyncPort,
  //  server: {baseDir: [webpackConfig.output.publicPath]}
  //})
);

devConfig.module.loaders[0].loaders.unshift('react-hot');

export default devConfig;
