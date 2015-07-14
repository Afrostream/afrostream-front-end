/* eslint-disable no-use-before-define, no-console */
'use strict';

import BrowserSync from 'browser-sync';
import childProcess from 'child_process';
import config from './config';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import nodemon from 'nodemon';
import notifier from 'node-notifier';
import path from 'path';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer-core';

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
const $ = gulpLoadPlugins();
const env = process.env.NODE_ENV || 'development';
const src = Object.create(null);
var isWatching = false;
var browserSync;
gulp.task('clean', clean);
gulp.task('js:lint', jsLint);
gulp.task('js:bundle', jsBundle);
gulp.task('browser-sync', browserSyncInitialize);

gulp.task('watch', function () {
  isWatching = true;
  runSequence(['js:lint', 'js:bundle', 'browser-sync', 'styles']);
});

gulp.task('nodemon', function () {
  nodemon({
    ignore: ['src/js/**', 'node_modules'],
    exec: 'npm run express',
    verbose: false
  });
});

// Static files
gulp.task('assets', (callback) => {
  src.assets = [
    'src/assets/**'
  ];
  return gulp.src(src.assets)
    .pipe($.changed('dist'))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'assets'}));
});

// Static files
gulp.task('styles', () => {
  src.styles = [
    'dist/**/*.css'
  ];

  //$.watch(['dist/**/*.*'].concat(
  //  src.styles.map(file => '!' + file)
  //), file => {
  //  browserSync.reload(path.relative(__dirname, file.path));
  //  console.log('reloading');
  //});
  //
  //return (isWatching ? $.watch(srcBlob) : gulp.src(srcBlob)).pipe($.size({title: 'less'}));

  // watch for changes
  return gulp.watch(src.styles).on('change', browserSync.reload);
});


gulp.task('dev', function (callback) {
  runSequence('js:bundle', ['watch', 'nodemon', 'assets'], callback);
});

gulp.task('build', function (callback) {
  runSequence('js:bundle', 'assets', callback);
});

function clean() {
  del('dist');
}

function jsLint() {
  var srcBlob = ['**/*.@(js|jsx)', '!node_modules/**/*', '!dist/**/*'];

  return (isWatching ? $.watch(srcBlob) : gulp.src(srcBlob))
    .pipe($.eslint())
    .pipe($.plumber({
      errorHandler(err) {
        if (isWatching) {
          let { fileName, lineNumber, message } = err;
          let relativeFilename = path.relative(process.cwd(), fileName);

          notifier.notify({
            title: 'ESLint Error',
            wait: true,
            message: `Line ${lineNumber}: ${message} (${relativeFilename})`
          }, (err, message) => {
            if (err) {
              console.error(err);
            }

            if (message.startsWith('Activate')) {
              childProcess.exec(`subl --command open_file ${fileName}:${lineNumber}`);
            }
          });
        }
      }
    }))
    .pipe($.eslint.failOnError())
    .pipe($.eslint.formatEach());
}

function jsBundle(callback) {
  const { webpackDevServer: { host, port } } = config;
  var webpackDevServerUrl = `http://${host}:${port}`;
  var babelLoader = {
    test: /\.jsx?$/,
    loaders: ['babel-loader'],
    exclude: [
      path.resolve(__dirname, 'node_modules')
    ]
  };

  var imgLoader =
  {
    test: /\.(jpeg|png|gif|svg)$/,
    loader: 'file'
  };

  var lessLoader = {
    test: /\.less$/,
    //loader: ExtractTextPlugin.extract('style-loader/useable', '!css-loader!less-loader!postcss-loader'),
    //loader: ExtractTextPlugin.extract('style-loader', '!css-loader!less-loader'),
    loader: 'style!css!less',
    exclude: [
      path.resolve(__dirname, 'node_modules')
    ]
  };

  var fontLoader = {
    test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'base64-font-loader',
    exclude: [
      path.resolve(__dirname, 'node_modules')
    ]
  };

  var webpackConfig = {
    devtool: '#inline-source-map',
    entry: {
      main: './src/js/main',
      vendor: './src/js/vendor'
    },
    resolve: {
      extensions: ['', '.jsx', '.js'],
      modulesDirectories: ['node_modules']
    },
    target: 'web',
    module: {
      loaders: [
        babelLoader,
        lessLoader,
        imgLoader,
        //fontLoader,
        {test: /.woff([\?]?.*)$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
        {test: /.ttf([\?]?.*)$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
        {test: /.eot([\?]?.*)$/, loader: 'file-loader'}
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': `"${env}"`
        }
      }),
      new ExtractTextPlugin('../styles/[name].css', {allChunks: false}),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    ],
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      publicPath: `${webpackDevServerUrl}/js/`,
      filename: '[name].js',
      chunkFilename: '[id].js'
    },
    //FIXME WHAT IS THIS
    //externals: {
    //  'react': 'React',
    //  'react/addons': 'React'
    //},
    postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
  };

  var devServerConfig = {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    quiet: true,
    noInfo: true,
    watch: true,
    watchDelay: 100,
    debug: true,
    stats: {
      colors: true
    }
  };

  if (env === 'production') {
    webpackConfig.devtool = '#source-map';
    webpackConfig.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    );
  }

  if (!isWatching) {
    webpack(webpackConfig).run(function (err) {
      if (err) {
        handleError(err);
      }

      if (callback) {
        callback();
      }
    });

  } else {
    webpackConfig.entry.main = [
      `webpack-dev-server/client?${webpackDevServerUrl}`,
      'webpack/hot/only-dev-server',
      webpackConfig.entry.main
    ];

    babelLoader.loaders.unshift('react-hot');
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, devServerConfig);

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.error($.util.colors.red('WebpackError'));
        stats.toJson().errors.forEach(err => console.error(err));
      }

      $.util.log('Finished', $.util.colors.cyan('jsBundle()'));
      if (browserSync !== undefined) {
        browserSync.reload();
      }
    });

    server.listen(config.webpackDevServer.port);
  }
}

function browserSyncInitialize() {
  browserSync = BrowserSync.create();
  browserSync.init({
    files: ['dist/**/*'],
    open: false,
    ui: false,
    logLevel: 'silent',
    port: config.browserSyncServer.port
  });
}

function handleError(err) {
  var { name, message } = err;

  console.error($.util.colors.red(name), message);

  if (isWatching) {
    notifier.notify({
      title: 'Build Error',
      message: 'Something went wrong.'
    });
  }
}
