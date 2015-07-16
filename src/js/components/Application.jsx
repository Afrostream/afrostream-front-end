import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

if (process.env.BROWSER) {
  require('./Application.less');
}

class Application extends React.Component {

  render() {
    const { props: { children } } = this;

    return (
      <div className="app">
        <Header />

        <div className="container-fluid">
          {children}
        </div>

        <Footer />
      </div>
    );
  }
}

export default Application;
