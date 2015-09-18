import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import webpackConfig from './webpack.config.js';
import merge from 'lodash/object/merge';
import config from '../config';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const prodConfig = merge({}, webpackConfig, {
  devtool: '#source-map',
  output: {
    publicPath: `/static/`,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js'
  },
  externals: [],
  node: {
    console: false
  },
  module: {
    //noParse: [/.\/superagent-mock$/]
  },
  plugins: webpackConfig.plugins.concat(
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js'),
    new ExtractTextPlugin('[name].[hash].css', {allChunks: true}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    //new webpack.IgnorePlugin(/.\/superagent-mock$/),
    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
});

delete prodConfig.module.preLoaders;

export default prodConfig;
