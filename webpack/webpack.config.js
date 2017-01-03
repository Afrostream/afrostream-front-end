import webpack, { DefinePlugin, BannerPlugin } from 'webpack'
import autoprefixer from 'autoprefixer-core'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ReactIntlPlugin from'react-intl-webpack-plugin'
import config from '../config'
import { merge } from 'lodash'
import herokuConfig from '../app.json'

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.LOAD_STAGING) {
  delete herokuConfig.env.NODE_ENV
  process.env = merge(process.env, herokuConfig.env)
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
    vtt: 'videojs-vtt.js',
    player: [
      'dashjs',
      'video.js',
      'koment-js',
      'afrostream-player'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-intl',
      'react-redux',
      'react-list',
      'react-virtualized',
      'redux',
      'fbjs/lib/ExecutionEnvironment',
      'history',
      'lodash',
      'moment',
      'classnames',
      'superagent',
      'jquery',
      'payment',
      'bootstrap',
      'raven-js',
      'mobile-detect',
      'q',
      'qs',
      'outdated-browser/outdatedbrowser/outdatedbrowser',
      'material-ui',
      './src/js/lib/localStoragePolyfill',
      './src/js/lib/customEventPolyfill',
      './src/js/lib/requestAnimationFramePolyfill'
    ]
  },
  resolve: {
    modulesDirectories: [
      'src',
      'server',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json', ''],
    loaderExtensions: ['.js', ''],
    loaderPostfixes: [''],
    unsafeCache: true,
    postfixes: ['']
  },
  profile: true,
  stats: {
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: true,
    modules: true,
    reasons: true,
    children: true,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: true
  },
  module: {
    preLoaders: [
      {test: /\.jsx?$/, loader: 'eslint-loader', exclude: [node_modules_dir]},
      {test: /\.js$/, loader: 'eslint-loader', exclude: [node_modules_dir]}
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader?cacheDirectory'],
        exclude: [node_modules_dir],
      },
      {
        test: /\.js$/, // include .js files
        loaders: ['babel-loader?cacheDirectory'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.css$/,
        loaders: [ExtractTextPlugin.extract('style-loader', 'css-loader')],
        include: [path.join(node_modules_dir, 'afrostream-player')]
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
        loader: 'file-loader?name=[name].[ext]?[hash]&limit=10000'
      },
      {
        test: /video\.js$/,
        loader: 'expose-loader?videojs',
        include: [path.join(node_modules_dir, 'afrostream-player')]
      },
      {
        test: /koment-js$/,
        loader: 'expose-loader?koment',
        include: [path.join(node_modules_dir, 'afrostream-player')]
      },
      {
        test: /jquery\.js$/, loader: 'expose-loader?$'
      },
      {
        test: /jquery\.js$/, loader: 'expose-loader?jQuery'
      },
      {
        test: /jquery\.js$/, loader: 'expose-loader?jquery'
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        loader: 'expose-loader?outdatedBrowser',
        include: [path.join(node_modules_dir, 'outdated-browser/outdatedbrowser')]
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        loaders: ['imports?this=>window'],
        include: [path.join(node_modules_dir, 'outdated-browser/outdatedbrowser')]
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        loaders: ['exports-loader?outdatedBrowser'],
        include: [path.join(node_modules_dir, 'outdated-browser/outdatedbrowser')]
      }
    ],
    exprContextCritical: false
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  //externals: {
  //  'window': 'Window'
  //},
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['player', 'vendor'],
      minChunks: 2
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]lang$/, /^\.\/(en|fr)$/),
    new webpack.ContextReplacementPlugin(/moment\.js[\/\\]locale$/, /^\.\/(fr|en)$/),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new ReactIntlPlugin(),
    new webpack.ProvidePlugin({
      koment: 'koment-js',
      videojs: 'video.js',
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `${JSON.stringify(process.env.NODE_ENV || 'development')}`,
        DOMAIN_HOST: JSON.stringify(process.env.DOMAIN_HOST),
        API_CLIENT_PROTOCOL: JSON.stringify(process.env.API_CLIENT_PROTOCOL),
        API_CLIENT_AUTHORITY: JSON.stringify(process.env.API_CLIENT_AUTHORITY),
        API_CLIENT_END_POINT: JSON.stringify(process.env.API_CLIENT_END_POINT),
        API_IMAGES_PROTOCOL: JSON.stringify(process.env.API_IMAGES_PROTOCOL),
        API_IMAGES_AUTHORITY: JSON.stringify(process.env.API_IMAGES_AUTHORITY),
        API_IMAGES_END_POINT: JSON.stringify(process.env.API_IMAGES_END_POINT),
        API_END_POINT: JSON.stringify(process.env.API_END_POINT),
        HEROKU_APP_NAME: JSON.stringify(process.env.HEROKU_APP_NAME),
        RECURLY_PUBLIC_KEY: JSON.stringify(process.env.RECURLY_PUBLIC_KEY),
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
        BRAINTREE_PUBLIC_KEY: JSON.stringify(process.env.BRAINTREE_PUBLIC_KEY),
        CHROMECAST_ID: JSON.stringify(process.env.CHROMECAST_ID),
        GOCARDLESS_PUBLIC_KEY: JSON.stringify(process.env.GOCARDLESS_PUBLIC_KEY),
        OAUTH_FACEBOOK_ENABLED: JSON.stringify(process.env.OAUTH_FACEBOOK_ENABLED),
        OAUTH_ORANGE_ENABLED: JSON.stringify(process.env.OAUTH_ORANGE_ENABLED),
        OAUTH_BOUYGUES_ENABLED: JSON.stringify(process.env.OAUTH_BOUYGUES_ENABLED),
        BITLY_ACCESS_TOKEN: JSON.stringify(process.env.BITLY_ACCESS_TOKEN),
        FB_TRACKING_ID: JSON.stringify(process.env.FB_TRACKING_ID),
        GA_TRACKING_ID: JSON.stringify(process.env.GA_TRACKING_ID),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        YOUBORA_ID: JSON.stringify(process.env.YOUBORA_ID),
        SPONSORSHIP_BILLING_UUID: JSON.stringify(process.env.SPONSORSHIP_BILLING_UUID),
        SUBDOMAIN: JSON.stringify(process.env.SUBDOMAIN)
      }
    })
  ],

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
}

export default webpackConfig
