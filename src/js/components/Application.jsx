import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './SideBar/SideBar';
import AlertMessage from './Alert/AlertMessage';
import SubtitleMessage from './Welcome/WelcomeComponents/SubtitleMessage';
import Modal from './Modal/Modal'
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import classSet from 'classnames';
import config from '../../../config';
import { metasData,analytics } from '../decorators';

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  var ga = require('react-ga');
}
@analytics()
@metasData()
@connect(({ Event,User }) => ({Event, User}))
class Application extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
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
        <Modal />
        <Header {...this.props}/>
        <SideBar />
        <AlertMessage />
        <div id="page-content-wrapper" className="container-fluid">
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}

export default Application;
