import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './SideBar/SideBar';
import CookieMessage from './Welcome/WelcomeComponents/CookieMessage';
import SubtitleMessage from './Welcome/WelcomeComponents/SubtitleMessage';
import Modal from './Modal/Modal'
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import classSet from 'classnames';
import config from '../../../config';
import { prepareRoute,metasData,analytics } from '../decorators';
import * as MovieActionCreators from '../actions/movie';
import * as CategoryActionCreators from '../actions/category';

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  var ga = require('react-ga');
}
@prepareRoute(async function ({ store , params: { movieId }}) {
  return await * [
    store.dispatch(CategoryActionCreators.getSpots()),
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMenu()),
    store.dispatch(CategoryActionCreators.getMeaList()),
    store.dispatch(MovieActionCreators.getMovie(movieId))
  ];
})
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
