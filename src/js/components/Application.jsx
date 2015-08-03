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
var Auth0Lock = require('auth0-lock');
var initialLock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);

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

  getIdToken() {

    var idToken = localStorage.getItem('afroToken');
    var authHash = initialLock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('afroToken', authHash.id_token);
      }
      if (authHash.error) {
        console.log("Error signing in", authHash);
      }
    }
    console.log('*** inside getIdToken ***');
    console.log(idToken);

    return idToken;
  }

  render() {
    var presetToken = this.getIdToken();

    const { props: { User, children } } = this;

    const token = User.get('token');
    const lock = User.get('lock');

    if (presetToken) {
      return(
        <div className="app">
          <ReturningUser lock={initialLock} idToken={presetToken}/>
        </div>
      );
    } else {

      return(
        <div className="app">
          <Welcome lock={initialLock} />
        </div>
      );
      /*return (
        <div className="app">
        <Header />
        <Navigation />

        <div className="container-fluid">
        {children}
        <Footer />
        </div>
        </div>
      );*/
    }
  }
}

export default Application;
