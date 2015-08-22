import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class AccountPage extends React.Component {

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (user) {
      console.log('*** here is the user in the account page ***');
      console.log(user.get('accountCode'));
      console.log('*** end of the user in the account page ***');

      return (
        <div className="row-fluid">
          <div className="container">
            <h1>Mon compte</h1>
          </div>
        </div>
      );
    }
  }
}

export default AccountPage;
