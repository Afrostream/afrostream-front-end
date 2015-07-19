import webpack from 'webpack';
import merge from 'lodash/object/merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpackConfig from './webpack.config.js';
import config from '../config';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const { webpackDevServer: { host, port } } = config;
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
);

devConfig.module.loaders[0].loaders.unshift('react-hot');

export default devConfig;