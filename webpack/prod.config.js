import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import merge from 'lodash/object/merge';
import config from '../config';
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const prodConfig = merge({}, webpackConfig, {
  devtool: '#source-map',
  output: {
    publicPath: `/static/`
  },
  externals: [
    /*
     /^react(\/.*)?$/,
     /^redux(\/.*)?$/,
     'superagent',
     'async'
     */],
  node: {
    console: false
    //global: false,
    //process: false,
    //Buffer: false,
    //__filename: false,
    //__dirname: false
  },
  //FIXME Replace mock remover for staging/production
  //module: {
  //  noParse: [/.\/superagent-mock$/]
  //},
  plugins: webpackConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      compress: {
        warnings: false,
        drop_console: true
      }
    })
    //FIXME Replace mock remover for staging/production
    // ignore dev config
    //new webpack.IgnorePlugin(/.\/superagent-mock$/)
  )
});

delete prodConfig.module.preLoaders;

export default prodConfig;
