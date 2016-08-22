import webpack from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpackConfig from './webpack.config'
import { merge } from 'lodash'
import path from 'path'

const node_modules_dir = path.resolve(__dirname, '../node_modules')
const productionMode = process.env.NODE_ENV === 'production'
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
let clientConfig = merge({}, webpackConfig, {
  devtool: productionMode ? 'eval' : '#cheap-module-source-map',
  output: {
    publicPath: `/static/`,
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  externals: [],
  node: {
    console: !productionMode,
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  module: {},
  plugins: webpackConfig.plugins.concat(
    new webpack.BannerPlugin('App has been developed by @benjipott Afrostream.'),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
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
        drop_console: productionMode,
        pure_funcs: productionMode ? ['vjs.log', 'videojs.log'] : []
      },
      minimize: true,
      sourceMap: !productionMode
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new CompressionPlugin({
      asset: '[file].gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
})

delete clientConfig.module.preLoaders;

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
