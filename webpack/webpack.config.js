import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import autoprefixer from 'autoprefixer-core';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HashPlugin from 'hash-webpack-plugin';
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
const node_modules_dir = path.resolve(__dirname, '../node_modules');
let hash = null;
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
    chunkFilename: '[id].js',
    hashDigestLength: 32
  },
  entry: {
    main: './src/js/main',
    vendor: './src/js/vendor'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  stats: {
    colors: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loaders: ['transform?brfs', 'transform?packageify']
      }, {
        test: /\.ejs$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loader: 'transform?ejsify'
      }, {
        test: /\.json$/,
        include: path.join(__dirname, '../node_modules/auth0-lock'),
        loader: 'json'
      },
      {
        test: /\.jsx?$/,
        loader: '',
        exclude: [node_modules_dir],
        loaders: ['babel-loader']
      },
      {
        test: /\.js$/, // include .js files
        loaders: ['babel-loader'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
        exclude: [node_modules_dir]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(gif|jpg|png|svg|favicon|ico|swf)/,
        loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000'
      },
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
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_CLIENT_END_POINT: JSON.stringify(process.env.API_CLIENT_END_POINT),
        API_END_POINT: JSON.stringify(process.env.API_END_POINT),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
        AUTH0_CALLBACK_URL: JSON.stringify(process.env.AUTH0_CALLBACK_URL),
        AUTH0_CONNECTION: JSON.stringify(process.env.AUTH0_CONNECTION),
        ALGOLIA_APP_ID: JSON.stringify(process.env.ALGOLIA_APP_ID),
        ALGOLIA_API_KEY: JSON.stringify(process.env.ALGOLIA_API_KEY),
        RECURLY_PUBLIC_KEY: JSON.stringify(process.env.RECURLY_PUBLIC_KEY),
        CHROMECAST_ID: JSON.stringify(process.env.CHROMECAST_ID),
        GA_TRACKING_ID: JSON.stringify(process.env.GA_TRACKING_ID)
      }
    }),
    new HashPlugin({path: assetsPath, fileName: 'hash.txt'})
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
};

export default webpackConfig;
