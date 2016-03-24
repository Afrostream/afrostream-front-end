import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import autoprefixer from 'autoprefixer-core';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HashPlugin from 'hash-webpack-plugin';
import config from '../config';
import merge from 'lodash/object/merge';
import herokuConfig from '../app.json';

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

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.LOAD_STAGING) {
  delete herokuConfig.env.NODE_ENV;
  process.env = merge(process.env, herokuConfig.env);
}
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
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      jquery: path.join(__dirname, '../node_modules/jquery/dist/jquery')
    }
  },
  stats: {
    colors: true
  },
  module: {
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
      },
      {
        test: /\.js$/, // include .js files
        loaders: ['babel-loader'],
        include: [path.join(__dirname, '../node_modules/bootstrap'), path.join(__dirname, '../node_modules/afrostream-player')]
      },
      {
        test: /\.json$/,
        include: [path.join(__dirname, '../node_modules/markdown-it'), path.join(__dirname, '../config')],
        loaders: ['json']
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
        test: /\.(gif|jpg|png|svg|favicon|ico|swf|xap)/,
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
      },
      //expose videojs
      //{
      //  test: /video\.js$/,
      //  loader: 'imports-loader?this=>global',
      //  include: [path.join(__dirname, '../node_modules/afrostream-player')]
      //},
      {
        test: /video\.js$/,
        loader: 'expose?videojs',
        include: [path.join(__dirname, '../node_modules/afrostream-player')]
      },
      //{test: /video\.js$/, loader: 'expose?videojs'},
      //expose jquery
      {test: /jquery\.js$/, loader: 'expose?$'},
      {test: /jquery\.js$/, loader: 'expose?jQuery'},
      {test: /jquery\.js$/, loader: 'expose?jquery'}
    ]
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  externals: {},
  plugins: [
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new webpack.ProvidePlugin({
      //videojs: 'video.js',
      //'window.videojs': 'video.js',
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_CLIENT_PROTOCOL: JSON.stringify(process.env.API_CLIENT_PROTOCOL),
        API_CLIENT_AUTHORITY: JSON.stringify(process.env.API_CLIENT_AUTHORITY),
        API_CLIENT_END_POINT: JSON.stringify(process.env.API_CLIENT_END_POINT),
        API_END_POINT: JSON.stringify(process.env.API_END_POINT),
        ALGOLIA_APP_ID: JSON.stringify(process.env.ALGOLIA_APP_ID),
        ALGOLIA_API_KEY: JSON.stringify(process.env.ALGOLIA_API_KEY),
        HEROKU_APP_NAME: JSON.stringify(process.env.HEROKU_APP_NAME),
        RECURLY_PUBLIC_KEY: JSON.stringify(process.env.RECURLY_PUBLIC_KEY),
        CHROMECAST_ID: JSON.stringify(process.env.CHROMECAST_ID),
        GOCARDLESS_PUBLIC_KEY: JSON.stringify(process.env.GOCARDLESS_PUBLIC_KEY),
        GA_TRACKING_ID: JSON.stringify(process.env.GA_TRACKING_ID)
      }
    }),
    new HashPlugin({path: assetsPath, fileName: 'hash.txt'})
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
};

export default webpackConfig;
