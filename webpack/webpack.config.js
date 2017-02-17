import webpack, { DefinePlugin, BannerPlugin } from 'webpack'
import autoprefixer from 'autoprefixer-core'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ReactIntlPlugin from'react-intl-webpack-plugin'
import config from '../config'
import { merge } from 'lodash'
import herokuConfig from '../app.json'
import Visualizer from 'webpack-visualizer-plugin'

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.LOAD_STAGING) {
  delete herokuConfig.env.NODE_ENV
  process.env = merge(process.env, herokuConfig.env)
}

const productionMode = process.env.NODE_ENV === 'production'

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
const nodeModulesPath = path.resolve(__dirname, '../node_modules')
const srcPath = path.resolve(__dirname, '../src')
const serverPath = path.resolve(__dirname, '../server')
let hash = null

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const {webpackDevServer: {host, port}} = config
const webpackDevServerUrl = `http://${host}:${port}`

const webpackConfig = {
  devtool: '#cheap-source-map',
  output: {
    path: assetsPath,
    publicPath: `${webpackDevServerUrl}/static/`,
    filename: '[name].js',
    chunkFilename: '[id].js',
    hashDigestLength: 32
  },
  entry: {
    // Set up an ES6-ish environment
    polyfills: [
      './src/js/lib/polyfills/localStoragePolyfill',
      './src/js/lib/polyfills/customEventPolyfill',
      './src/js/lib/polyfills/requestAnimationFramePolyfill',
      'ismobilejs'
    ],
    main: './src/js/main',
    player: [
      'afrostream-player'
    ],
    vendor: [
      'classnames',
      'fbjs/lib/ExecutionEnvironment',
      'gsap',
      'history',
      'iban',
      'immutable',
      'intl',
      'lodash',
      'material-ui',
      'mobile-detect',
      'moment',
      'outdated-browser/outdatedbrowser/outdatedbrowser',
      'payment',
      'q',
      'qs',
      'raven-js',
      'react',
      'react-dom',
      'react-sticky',
      'react-helmet',
      'react-tooltip',
      'react-slick',
      'react-router',
      'react-intl',
      'react-intl-redux',
      'react-redux',
      'react-list',
      'react-virtualized',
      'redux',
      'redux-router',
      'superagent',
      'url',
      'xhr'
    ]
  },
  resolve: {
    modules: [
      srcPath,
      serverPath,
      nodeModulesPath,
    ],
    extensions: ['.js', '.jsx', '.json', '.less']
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
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: ['babel-loader'],
        exclude: [nodeModulesPath],
      },
      {
        test: /\.(jsx|js)$/,
        enforce: 'pre',
        use: [{
          options: {
            configFile: path.join(__dirname, '../.eslintrc'),
            useEslintrc: false
          },
          loader: 'eslint-loader'
        }],
        exclude: [nodeModulesPath]
      },
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }),
        include: [path.join(nodeModulesPath, 'afrostream-player')]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.(gif|jpg|png|svg|favicon|ico|swf|xap)/,
        use: 'url-loader?name=[name].[ext]?[hash]&limit=10000'
      },
      {
        test: /.(woff|woff2)([\?]?.*)$/,
        use: 'url-loader?name=[name].[ext]?[hash]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /.ttf([\?]?.*)$/,
        use: 'url-loader?name=[name].[ext]?[hash]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /.eot([\?]?.*)$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /videojs-vtt\.js/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /ismobilejs/,
        use: 'file-loader?name=[name].[ext]?[hash]',
        include: [path.join(nodeModulesPath, 'ismobilejs')]
      },
      {
        test: /.*polyfills/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /video\.js$/,
        use: 'expose-loader?videojs',
        include: [path.join(nodeModulesPath, 'afrostream-player')]
      },
      {
        test: /mobile-detect/, use: 'expose-loader?MobileDetect'
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        use: 'expose-loader?outdatedBrowser',
        include: [path.join(nodeModulesPath, 'outdated-browser/outdatedbrowser')]
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        use: ['imports-loader?this=>window'],
        include: [path.join(nodeModulesPath, 'outdated-browser/outdatedbrowser')]
      },
      {
        test: /outdated-browser\/outdatedbrowser\/outdatedbrowser*/,
        use: ['exports-loader?outdatedBrowser'],
        include: [path.join(nodeModulesPath, 'outdated-browser/outdatedbrowser')]
      }
    ],
    exprContextCritical: false
  },
  node: {
    __dirname: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  //externals: {
  //  'window': 'Window'
  //},
  plugins: [
    new Visualizer(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['player', 'vendor'],
      //async: process.env.NODE_ENV === 'production',
      minChunks: 2
    }),
    new webpack.LoaderOptionsPlugin({
      debug: !productionMode,
      minimize: productionMode,
      sourceMap: !productionMode,
      options: {
        postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
      }
    }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]lang$/, /^\.\/(en|fr)$/),
    new webpack.ContextReplacementPlugin(/moment\.js[\/\\]locale$/, /^\.\/(fr|en)$/),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
      disable: false
    }),
    new ReactIntlPlugin(),
    new webpack.ProvidePlugin({
      MobileDetect: 'mobile-detect',
      videojs: 'video.js'
    }),
    new webpack.DefinePlugin({
      'global.GENTLY': false,
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
  ]
}

export default webpackConfig
