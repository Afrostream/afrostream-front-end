import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import devConfig from './dev.config';
import config from '../config';

const { webpackDevServer: { host, port } } = config;
var webpackDevServerUrl = `http://${host}:${port}`;
const serverOptions = {
    contentBase: webpackDevServerUrl,
    publicPath: devConfig.output.publicPath,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
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

webpackDevServer.listen(port, host, function () {
  console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
});
