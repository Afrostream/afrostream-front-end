import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import autoprefixer from 'autoprefixer-core';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from '../config';

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];

const assetsPath = path.resolve(__dirname, '../dist/');
//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const { webpackDevServer: { host, port } } = config;
const webpackDevServerUrl = `http://${host}:${port}`;

const webpackConfig = {
  devtool: '#inline-source-map',
  output: {
    path: assetsPath,
    publicPath: `${webpackDevServerUrl}/static/`,
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  entry: {
    main: './src/js/main',
    vendor: './src/js/vendor'
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
    modulesDirectories: ['node_modules']
  },
  stats: {
    colors: true
  },
  module: {
    //preLoaders: [
    //  {
    //    test: /\.js$/, // include .js files
    //    exclude: /node_modules/, // exclude any and all files in the node_modules folder
    //    loaders: ['babel-loader']
    //    //, 'jshint-loader'
    //  }
    //],
    loaders: [
      //Auth0 required
      //{
      //  test: /.js/,
      //  include: path.join(__dirname, '../node_modules/auth0-lock'),
      //  loaders: ['transform?packageify', 'transform?brfs']
      //}, {
      //  test: /.ejs/,
      //  include: path.join(__dirname, '../node_modules/auth0-lock'),
      //  loader: 'transform?ejsify'
      //}, {
      //  test: /.json/,
      //  include: path.join(__dirname, '../node_modules/auth0-lock'),
      //  loader: 'json'
      //},
      {
        test: /\.js$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loaders: ['transform?brfs', 'transform?packageify']
      }, {
        test: /\.ejs$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loader: 'transform?ejsify'
      }, {
        test: /.json$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loader: 'json'
      },
      {
        test: /\.jsx?$/,
        loader: '',
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/, // include .js files
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(gif|jpg|png|svg|favicon|ico|swf)/,
        loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000'
      },
      //Font-awasome
      //{test: /\.woff($|\?)/, loader: 'url-loader'},
      //{test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
      //{test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'},
      //END FONT AWASOME
      {
        test: /.(woff|woff2)([\?]?.*)$/,
        loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /.ttf([\?]?.*)$/,
        loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /.eot([\?]?.*)$/,
        loader: 'file-loader?name=[name].[ext]?[hash]'
      },
      //{
      //  test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)$/,
      //  loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000&mimetype=application/octet-stream'
      //},
      {
        test: /.txt([\?]?.*)$/,
        loader: 'raw-loader'
      }

      //,

    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css?[hash]', {allChunks: true}),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
};

export default webpackConfig;
