import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpackConfig from './webpack.config.js';
import merge from 'lodash/object/merge';
import config from '../config';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const prodConfig = merge({}, webpackConfig, {
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  output: {
    publicPath: `/static/`,
    filename: '[name].js?[hash]',
    chunkFilename: '[id].js?[hash]'
  },
  externals: [],
  node: {
    console: process.env.NODE_ENV === 'production' ? false : true,
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  module: {
    //noParse: [/.\/superagent-mock$/]
  },
  plugins: webpackConfig.plugins.concat(
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js?[hash]'),
    new ExtractTextPlugin('[name].css?[hash]', {allChunks: true}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      output: {comments: false},
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: process.env.NODE_ENV === 'production' ? true : false,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['vjs.log', 'videojs.log'] : []
      },
      minimize: true,
      sourceMap: process.env.NODE_ENV === 'production'
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
