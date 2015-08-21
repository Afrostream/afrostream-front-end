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
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_CLIENT_END_POINT: JSON.stringify(process.env.API_CLIENT_END_POINT),
        API_END_POINT: JSON.stringify(process.env.API_END_POINT),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
        AUTH0_CALLBACK_URL: JSON.stringify(process.env.AUTH0_CALLBACK_URL),
      }
    })
    //FIXME Replace mock remover for staging/production
    // ignore dev config
    //new webpack.IgnorePlugin(/.\/superagent-mock$/)
  )
});

delete prodConfig.module.preLoaders;

export default prodConfig;
