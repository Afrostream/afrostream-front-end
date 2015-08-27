import React from 'react';
import { connect } from 'react-redux';
import BrowsePage from './Browse/BrowsePage';
import WelcomePage from './Welcome/WelcomePage';

@connect(({ User }) => ({User})) class HomePage extends React.Component {

  render() {

    const { props: { User } } = this;
    const token = User.get('token');
    const user = User.get('user');
    return (
      <div className="row-fluid">
        {token && user ? <BrowsePage /> :
          <WelcomePage />}
      </div>
    );
  }
}

export default HomePage;
