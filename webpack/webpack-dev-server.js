import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import path from 'path'
import devConfig from './dev.config'
import config from '../config'

const {webpackDevServer: {host, port}} = config

const serverOptions = {
    contentBase: path.resolve(__dirname, '../dist'),
    publicPath: devConfig.output.publicPath,
    hot: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    quiet: true,
    noInfo: true,
    cache: false,
    watch: true,
    progress: true,
    devServer: true,
    hotComponents: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    debug: true,
    devServer: {
      port: port,
      historyApiFallback: true
    },
    stats: {
      colors: true
    }
  },
  compiler = webpack(devConfig),
  webpackDevServer = new WebpackDevServer(compiler, serverOptions)

compiler.plugin('done', (stats) => {
  process.env.HASH_FILE = stats.hash
  if (stats.hasErrors()) {
    console.error('WebpackError')
    stats.toJson().errors.forEach(err => console.error(err))
  }
  if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
    console.log(stats.compilation.errors);
    process.exit(1); // or throw new Error('webpack build failed.');
  }
})

webpackDevServer.listen(port, function () {
  console.info('==> 🚧  Webpack development server listening on %s:%s', host, port)
})
