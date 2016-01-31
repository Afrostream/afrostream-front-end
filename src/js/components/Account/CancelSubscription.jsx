import React,{PropTypes } from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';

if (process.env.BROWSER) {
  require('./CancelSubscription.less');
}

@connect(({ User }) => ({User}))
class CancelSubscription extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  cancelSubscription() {

    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.cancelSubscription());
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const cancelled = User.get('subscriptionCancelled');

    if (!cancelled) {
      return (
        <div className="row-fluid brand-bg">
          <div className="container brand-bg">
            <div className="account-credit-card">
              <h1>Annuler votre abonnement?</h1>

              <div className="account-credit-card-details">
                Cliquer sur « Annuler l’abonnement » pour suspendre votre abonnement.
                Vous n’aurez plus accès au service à la fin de la période de votre abonnement
                (soit à partir du jour anniversaire du mois suivant)
              </div>
              <button className="button-cancel-subscription"
                      onClick={::this.cancelSubscription}>Annuler l’abonnement
              </button>
              <Link className="button-return-mon-compte" to="/compte">Retourner sur mon compte</Link>
            </div>
          </div>
        </div>
      );
    } else {

      return (
        <div className="row-fluid brand-bg">
          <div className="container brand-bg">
            <div className="account-credit-card">
              <h1>Votre abonnement été annulé.</h1>
              <div className="account-credit-card-details">
                Vous n’aurez plus accès au service à la fin de la période de votre abonnement
                (soit à partir du jour anniversaire du mois suivant)
              </div>
              <Link className="button-return-mon-compte" to="/compte">Retourner sur mon compte</Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default CancelSubscription;
