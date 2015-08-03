import React from 'react';
import { prepareRoute } from '../decorators';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Navigation from './Navigation/Navigation';
import Welcome from './Welcome/Welcome';
import UserButton from './User/UserButton';
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

  render() {

    const {
      props: {
        dispatch,
        User,
        children
        }
      } = this;

    const token = User.get('token');
    const user = User.get('user');

    if (token) {
      if (user) {

        //if (user.paymentStatus !== true) {
        //  return (<ReturningUser children={this.props.children}/>);
        //}
        //
        //else {

        return (
          <div className="app">

            <div className="container-fluid">
              {children}
              <Footer />
            </div>
          </div>
        );

        //}
      } else {
        dispatch(UserActionCreators.getProfile());
        return <div />
      }
    }
    else {

      return (<Welcome />);
    }
  }
}

export default Application;
