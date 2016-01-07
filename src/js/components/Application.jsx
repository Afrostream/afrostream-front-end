import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './SideBar/SideBar';
import AlertMessage from './Alert/AlertMessage';
import SubtitleMessage from './Welcome/WelcomeComponents/SubtitleMessage';
import Modal from './Modal/Modal'
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import classSet from 'classnames';
import { metasData,analytics } from '../decorators';

if (process.env.BROWSER) {
  require('./Application.less');
}

@metasData()
@analytics()
@connect(({ Event,User }) => ({Event, User}))
class Application extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

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
