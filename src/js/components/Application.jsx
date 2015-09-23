import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './SideBar/SideBar';
import CookieMessage from './Welcome/WelcomeComponents/CookieMessage';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import classSet from 'classnames';
import config from '../../../config';

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  var ga = require('react-ga');
}

@connect(({ Event,User }) => ({Event, User})) class Application extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    willTransitionTo: function (transition, params, query, callback) {
      if (canUseDOM) {
        ga.pageview(transition.router.state.location.pathname);
      }
    }
  };

  componentWillMount() {
    if (canUseDOM) {
      ga.initialize(config.google.analyticsKey, {debug: true});
    }
  }

  render() {

    const { props: { children,Event,User } } = this;
    const toggled = User.get('user') && Event.get('sideBarToggled');
    let appClasses = {
      'app': true,
      'toggled': toggled
    };

    return (

      <div className={classSet(appClasses)}>
        <Header {...this.props}/>
        <SideBar />
        <CookieMessage />

        <div id="page-content-wrapper" className="container-fluid">
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}

export default Application;
