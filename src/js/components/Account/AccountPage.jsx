import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';

@connect(({ User }) => ({User})) class AccountPage extends React.Component {

  render() {
    const {
      props: {
        User
        }
      } = this;

    return (
      <div className="row-fluid">
        <div className="container">
          <h1>Mon compte</h1>
        </div>
      </div>
    );
  }
}

export default AccountPage;
