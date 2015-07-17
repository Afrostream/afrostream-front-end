import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import path from 'path';
import devConfig from './dev.config';
import config from '../config';

const { webpackDevServer: { host, port } } = config;
const serverOptions = {
    contentBase: path.resolve(__dirname, '../dist'),
    publicPath: devConfig.output.publicPath,
    hot: true,
    quiet: true,
    noInfo: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    debug: true,
    stats: {
      colors: true
    }
  },
  compiler = webpack(devConfig),
  webpackDevServer = new WebpackDevServer(compiler, serverOptions);

compiler.plugin('done', (stats) => {
  if (stats.hasErrors()) {
    console.error('WebpackError');
    stats.toJson().errors.forEach(err => console.error(err));
  }

  console.log('Finished', 'jsBundle()');
});

webpackDevServer.listen(port, function () {
  console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
});
