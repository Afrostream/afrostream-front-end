import webpack from 'webpack';
import merge from 'lodash/object/merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import webpackConfig from './webpack.config.js';
import config from '../config';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const { webpackDevServer: { host, port } } = config;
const { browserSyncServer: { bSyncHost, bSyncPort } } = config;
var webpackDevServerUrl = `http://${host}:${port}`;
const devConfig = merge({}, webpackConfig, {
  devtool: 'eval-source-map',
  debug: true
});

devConfig.entry.main = [
  `webpack-dev-server/client?${webpackDevServerUrl}`,
  'webpack/hot/only-dev-server',
  devConfig.entry.main
];

devConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
  //new BrowserSyncPlugin({
  //  host: bSyncHost,
  //  port: bSyncPort,
  //  server: {baseDir: [webpackConfig.output.publicPath]}
  //})
);

devConfig.module.loaders[0].loaders.unshift('react-hot');

export default devConfig;