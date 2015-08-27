import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import config from '../../../config/client';
import * as CategoryActionCreators from '../actions/category';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./Application.less');
}

if (canUseDOM) {
  require('jquery');
  require('bootstrap');
}

class Application extends React.Component {

  render() {

    const { props: {  children } } = this;

    return (
      <div className="app">
        <Header {...this.props}/>

        <div className="container-fluid">
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}

export default Application;
