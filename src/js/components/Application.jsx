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

  render() {
    const { props: { User, children } } = this;

    const token = User.get('token');
    const lock = User.get('lock');

    console.log('*** here is the token ***');
    console.log(token);
    console.log('*** end of the token ***');

    if (token) {
      return(
        <div className="app">
          <ReturningUser lock={lock} idToken={token}/>
        </div>
      );
    } else {

      return(
        <div className="app">
          <Welcome lock={lock} />
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
