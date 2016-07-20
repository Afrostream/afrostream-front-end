import webpack, { DefinePlugin, BannerPlugin } from 'webpack'
import autoprefixer from 'autoprefixer-core'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HashPlugin from 'hash-webpack-plugin'
import config from '../config'
import { merge } from 'lodash'
import herokuConfig from '../app.json'

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.LOAD_STAGING) {
  delete herokuConfig.env.NODE_ENV;
  process.env = merge(process.env, herokuConfig.env);
}

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
]

const assetsPath = path.resolve(__dirname, '../dist/')
const node_modules_dir = path.resolve(__dirname, '../node_modules')
let hash = null

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const {webpackDevServer: {host, port}} = config
const webpackDevServerUrl = `http://${host}:${port}`

const webpackConfig = {
  devtool: '#inline-eval-cheap-source-map',
  output: {
    path: assetsPath,
    publicPath: `${webpackDevServerUrl}/static/`,
    filename: '[name].js',
    chunkFilename: '[id].js',
    hashDigestLength: 32
  },
  entry: {
    // Set up an ES6-ish environment
    polyfill: 'babel-polyfill',
    main: './src/js/main',
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'redux',
      'fbjs/lib/ExecutionEnvironment',
      'history',
      'lodash',
      'classnames',
      'raven-js',
      'superagent',
      'jquery',
      'jquery.payment',
      'bootstrap',
      'raven-js',
      'mobile-detect',
      'qs',
      'videojs-vtt.js/dist/vtt.js',
      'afrostream-player/node_modules/dashjs/dist/dash.all.debug.js',
      'afrostream-player/node_modules/video.js/dist/video.js',
      'afrostream-player/dist/afrostream-player.js',
      'sendbird',
      'chardin.js'
    ]
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
      },
      //{
      //  test: /\.js$/, // include .js files
      //  loaders: ['babel'],
      //  include: [
      //    path.join(__dirname, '../node_modules/afrostream-player/src/js/'),
      //    path.join(__dirname, '../node_modules/afrostream-player/node_modules/videojs-chromecast/es5/js'),
      //    path.join(__dirname, '../node_modules/afrostream-player/node_modules/videojs-youtube/es5')
      //  ],
      //  query: {
      //    presets: ['es2015', 'stage-0']
      //  }
      //},
      {
        test: /\.json$/,
        //include: [
        //  path.join(__dirname, '../node_modules/markdown-it'),
        //  path.join(__dirname, '../node_modules/sendbird'),
        //  path.join(__dirname, '../config')
        //],
        loaders: ['json']
      },
      {
        test: /\.css$/,
        loaders: [ExtractTextPlugin.extract('style-loader', 'css-loader')],
        include: [path.join(__dirname, '../node_modules/afrostream-player')]
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
      {
        test: /vtt\.js$/,
        loader: 'url-loader?name=[name].[ext]?[hash]&limit=10000',
        include: [path.join(__dirname, '../node_modules/afrostream-player')]
      },
      {
        test: /video\.js$/,
        loader: 'expose?videojs',
        include: [path.join(__dirname, '../node_modules/afrostream-player')]
      },
      {
        test: /sendbird\.js$/, loader: 'expose?sendBirdClient'
      },
      {
        test: /chardin\.js$/, loader: 'expose?chardinJs'
      },
      {
        test: /jquery\.js$/, loader: 'expose?$'
      },
      {
        test: /jquery\.js$/, loader: 'expose?jQuery'
      },
      {
        test: /jquery\.js$/, loader: 'expose?jquery'
      }
    ],
    exprContextCritical: false
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
  ,
  externals: {
    'window': 'Window'
  }
  ,
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\\\/]lang$/, /^\.\/(en|fr)$/),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new webpack.ProvidePlugin({
      sendBirdClient: 'sendbird',
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `${JSON.stringify(process.env.NODE_ENV || 'development')}`,
        API_CLIENT_PROTOCOL: JSON.stringify(process.env.API_CLIENT_PROTOCOL),
        API_CLIENT_AUTHORITY: JSON.stringify(process.env.API_CLIENT_AUTHORITY),
        API_CLIENT_END_POINT: JSON.stringify(process.env.API_CLIENT_END_POINT),
        API_END_POINT: JSON.stringify(process.env.API_END_POINT),
        ALGOLIA_APP_ID: JSON.stringify(process.env.ALGOLIA_APP_ID),
        ALGOLIA_API_KEY: JSON.stringify(process.env.ALGOLIA_API_KEY),
        HEROKU_APP_NAME: JSON.stringify(process.env.HEROKU_APP_NAME),
        RECURLY_PUBLIC_KEY: JSON.stringify(process.env.RECURLY_PUBLIC_KEY),
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
        BRAINTREE_PUBLIC_KEY: JSON.stringify(process.env.BRAINTREE_PUBLIC_KEY),
        CHROMECAST_ID: JSON.stringify(process.env.CHROMECAST_ID),
        GOCARDLESS_PUBLIC_KEY: JSON.stringify(process.env.GOCARDLESS_PUBLIC_KEY),
        OAUTH_FACEBOOK_ENABLED: JSON.stringify(process.env.OAUTH_FACEBOOK_ENABLED),
        OAUTH_ORANGE_ENABLED: JSON.stringify(process.env.OAUTH_ORANGE_ENABLED),
        OAUTH_BOUYGUES_ENABLED: JSON.stringify(process.env.OAUTH_BOUYGUES_ENABLED),
        FB_TRACKING_ID: JSON.stringify(process.env.FB_TRACKING_ID),
        GA_TRACKING_ID: JSON.stringify(process.env.GA_TRACKING_ID),
        YOUBORA_ID: JSON.stringify(process.env.YOUBORA_ID),
        SPONSORSHIP_BILLING_UUID: JSON.stringify(process.env.SPONSORSHIP_BILLING_UUID),
        SENDBIRD_APP_ID: JSON.stringify(process.env.SENDBIRD_APP_ID)
      }
    }),
    new HashPlugin({path: assetsPath, fileName: 'hash.txt'})
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
}

export default webpackConfig
