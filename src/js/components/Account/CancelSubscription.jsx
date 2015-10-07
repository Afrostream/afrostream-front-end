import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';

if (process.env.BROWSER) {
  require('./CancelSubscription.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class CancelSubscription extends React.Component {

  getInitialState() {

    return {
      cardNumber: null
    }
  };

  componentDidMount() {

  }

  cancelSubscription() {

    const {
      props: {
        dispatch
      }
    } = this;

    dispatch(UserActionCreators.cancelSubscription()).then(function () {
      console.log('*** appears that cancel subscription was called with success ***');
    }).catch(function (err) {
      let errors = err.response.body;
      console.log('**** there was some sort of error ***');
      console.log(errors);
      console.log('*** end of erors ***');
    });

  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');

    if (user) {
      return (
        <div className="row-fluid brand-bg">
          <div className="container brand-bg">
            <div className="account-credit-card">
              <h1>Annuler votre abonnement?</h1>
              <div className="account-credit-card-details">
                Click "Finish Cancellation" below to cancel your streaming plan.
                Cancellation will be effective at the end of your current billing period.
              </div>
              <button onClick={::this.cancelSubscription}>Annuler votre abonnement</button>
              <Link to="/compte">Retourne a la page de mon compte</Link>
            </div>
          </div>
        </div>
      );
    } else {

      return (
        <div className="row-fluid">
          no user found
        </div>
      );
    }
  }
}

export default CancelSubscription;
