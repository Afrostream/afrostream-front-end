import React from 'react';
import { prepareRoute } from '../decorators';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Navigation from './Navigation/Navigation';
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
  //debugger;
  //Auth0Lock = require('auth0-lock');
  require('jquery');
  require('bootstrap');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(CategoryActionCreators.getMenu())
    ];
}) @connect(({ User }) => ({User})) class Application extends React.Component {

  componentDidMount() {
    this.createLock();
  }

  createLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(UserActionCreators.createLock());
    dispatch(UserActionCreators.getIdToken());
  }

  //getIdToken() {
  //
  //  //debugger;
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
  //    console.log('*** inside getIdToken ***');
  //    console.log(idToken);
  //
  //    return idToken;
  //  }
  //}

  render() {
    debugger;
    //var presetToken = this.getIdToken();

    const { props: { User, children } } = this;

    const token = User.get('token');
    const lock = User.get('lock');

    console.log(token, lock);

    if (token && user) {

      if (user.paymentStatus !== true) {
        return (<ReturningUser lock={lock} idToken={token} children={this.props.children}/>);
      }

      else {

        return (
          <div className="app">
            <Header />
            <Navigation />

            <div className="container-fluid">
              {children}
              <Footer />
            </div>
          </div>
        );

      }
    }
    else {

      return (<Welcome lock={lock}/>);
    }
  }
}

export
default
Application;
