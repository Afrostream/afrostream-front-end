import React from 'react';
import { prepareRoute } from '../decorators';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Welcome from './Welcome/Welcome';
import ReturningUser from './Welcome/ReturningUser';
import * as CategoryActionCreators from '../actions/category';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import * as UserActionCreators from '../actions/user';
import { connect } from 'react-redux';

import config from '../../../config/client';
var Auth0Lock;
var initialLock;

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  require('jquery');
  require('bootstrap');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(CategoryActionCreators.getMenu())
    ];
}) @connect(({ User }) => ({User})) class Application extends React.Component {

  //getIdToken() {
  //
  //  if (canUseDOM) {
  //    var idToken = localStorage.getItem('afroToken');
  //    initialLock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);
  //    var authHash = initialLock.parseHash(window.location.hash);
  //
  //    if (!idToken && authHash) {
  //      if (authHash.id_token) {
  //        idToken = authHash.id_token
  //        localStorage.setItem('afroToken', authHash.id_token);
  //      }
  //      if (authHash.error) {
  //        console.log("Error signing in", authHash);
  //      }
  //    }
  //
  //    return idToken;
  //  }
  //}

  render() {

    //var presetToken = this.getIdToken();

    const { props: { User, children } } = this;
    const token = User.get('token');
    const lock = User.get('lock');

    //if (presetToken && this.props.paymentStatus !== true) {
    //  return (<ReturningUser lock={initialLock} idToken={presetToken} children={this.props.children}/>);
    //}
    //
    //else if (presetToken && this.props.paymentStatus === true) {
    return (
      <div className="app">
        <Header {...this.props}/>

        <div className="container-fluid">
          {token ? children : <Welcome />}
          <Footer />
        </div>
      </div>
    );

  }
}

export default Application;
