import WebpackDevServer from 'webpack-dev-server'
import path from 'path'
import webpack from 'webpack'
import devConfig from './dev.config'
import config from '../config'
import { merge } from 'lodash'

const {webpackDevServer: {host, port}} = config

const serverOptions = {
    contentBase: path.resolve(__dirname, '../dist'),
    publicPath: devConfig.output.publicPath
  },
  compiler = webpack(devConfig),
  webpackDevServer = new WebpackDevServer(compiler, merge(serverOptions, devConfig.devServer))

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
