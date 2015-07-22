import React from 'react';
import { prepareRoute } from '../decorators';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Navigation from './Navigation/Navigation';
import * as CategoryActionCreators from '../actions/category';

if (process.env.BROWSER) {
  require('./Application.less');
}

@prepareRoute(async function ({ redux }) {
  return await * [
      redux.dispatch(CategoryActionCreators.getMenu())
    ];
}) class Application extends React.Component {

  render() {
    const { props: { children } } = this;

    return (
      <div className="app">
        <Header />
        <Navigation />

        <div className="container-fluid">
          {children}
        </div>

        <Footer />
      </div>
    );
  }
}

export default Application;
