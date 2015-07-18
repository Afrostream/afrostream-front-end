import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import autoprefixer from 'autoprefixer-core';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from '../config';

const env = process.env.NODE_ENV || 'development';
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

const assetsPath = path.resolve(__dirname, '../dist/js');
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
    publicPath: `${webpackDevServerUrl}/js/`,
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
    preLoaders: [
      {
        test: /\.js$/, // include .js files
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        loaders: ['babel-loader']
        //, 'jshint-loader'
      }
    ],
    loaders: [
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
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', '!css-loader!less-loader'),
        exclude: /node_modules/
      },
      {test: /\.gif/, loader: 'file-loader!url-loader?limit=10000&minetype=image/gif'},
      {test: /\.jpg/, loader: 'file-loader!url-loader?limit=10000&minetype=image/jpg'},
      {test: /\.png/, loader: 'file-loader!url-loader?limit=10000&minetype=image/png'},
      {test: /\.svg/, loader: 'file-loader!url-loader?limit=10000&minetype=image/svg'},
      {test: /\.favicon/, loader: 'file-loader!url-loader?limit=10000&minetype=image/favicon'},
      //fontLoader,
      {test: /.woff([\?]?.*)$/, loader: 'file-loader!url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /.ttf([\?]?.*)$/, loader: 'file-loader!url-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /.eot([\?]?.*)$/, loader: 'file-loader'}
    ]
  },
  plugins: [
    new ExtractTextPlugin('../styles/[name].css', {allChunks: false}),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
};

export default webpackConfig;
