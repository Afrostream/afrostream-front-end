import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import merge from 'lodash/object/merge';
import config from '../config';
const STYLE_LOADER = 'style-loader';
const CSS_LOADER = 'css-loader';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const { server: { host, port } } = config;
const serverUrl = `http://${host}:${port}`;
console.log(serverUrl);
const prodConfig = merge({}, webpackConfig, {
  devtool: '#source-map',
  externals: /^[a-z][a-z\.\-0-9]*$/,
  output: {
    publicPath: `${serverUrl}/js/`
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: webpackConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
  //,
  //module: {
  //  loaders: webpackConfig.module.loaders.map(function (loader) {
  //    // Remove style-loader
  //    return merge(loader, {
  //      loader: loader.loader = loader.loader.replace(STYLE_LOADER + '!', '')
  //    });
  //  })
  //}
});

delete prodConfig.module.preLoaders;

export default prodConfig;