import React ,{PropTypes } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
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

    const { props: { children } } = this;

    return (
      <div className="app">
        <div className="container-fluid">
          <Header {...this.props}/>

          {children}
          <Footer />
        </div>
      </div>
    );
  }
}

export default Application;
