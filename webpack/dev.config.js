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
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader', 'react-hot'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', '!css-loader!less-loader'),
        exclude: /node_modules/
      }
    ]
  }
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

export default devConfig;