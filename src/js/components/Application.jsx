import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './SideBar/SideBar';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  require('jquery');
  require('bootstrap');
}

@connect(({ Event,User }) => ({Event, User})) class Application extends React.Component {

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

        <div id="page-content-wrapper" className="container-fluid">
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}

export default Application;
