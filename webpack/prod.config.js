import webpack from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'
import webpackConfig from './webpack.config'
import { merge } from 'lodash'
import path from 'path'
import fs from 'fs'

const assetsPath = path.resolve(__dirname, '../dist')
const node_modules_dir = path.resolve(__dirname, '../node_modules')
const productionMode = process.env.NODE_ENV === 'production'
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
let clientConfig = merge({}, webpackConfig, {
  devtool: productionMode ? 'hidden-source-map' : 'eval-source-map',
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
    //WEBPACK2 FEATURE
    //new webpack.LoaderOptionsPlugin({
    //  debug: false,
    //  minimize: true,
    //  sourceMap: !productionMode
    //}),
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

let nodeModules = {}
fs.readdirSync(node_modules_dir)
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

let serverConfig = merge({}, {
  entry: {
    server: './server'
  },
  output: {
    path: assetsPath,
    publicPath: `/static/`,
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.node']
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    rules: [
      {test: /\.node$/, loader: 'node-loader'},
      {test: /\.json$/, loader: 'json'},
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.js$/, // include .js files
        use: ['babel-loader'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.(ico)$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=img/[path][name].[ext]&context=./app/images'
      }
    ]
  },

  target: 'node',

  plugins: [
    new webpack.IgnorePlugin(/\.(css|less|sass|gif|jpg|png|svg|favicon|ico|swf|xap)$/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'server',
      filename: 'server.js',
      minChunks: Infinity
    }),
  ],

  devtool: 'source-map'
})

export default [clientConfig, serverConfig]
