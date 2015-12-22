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
    location: PropTypes.object.isRequired
  };

  state = {
    subscriptionCancelled: false
  };

  cancelSubscription() {

    const {
      props: {
        dispatch
        }
      } = this;
    let self = this;

    dispatch(UserActionCreators.cancelSubscription()).then(function () {
      self.setState({
        subscriptionCancelled: true
      });
    }).catch(function (err) {
      console.log(err);
    });

  }

  navigateToAccountPage(event) {
    event.preventDefault();

    let location = this.context.location;
    if (!location.goBack()) {
      location.transitionTo('/compte');
    }
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');

    if (user) {

      if (this.state.subscriptionCancelled == false) {

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
                <button className="button-cancel-subscription" onClick={::this.cancelSubscription}>Annuler
                  l’abonnement
                </button>
                <button className="button-return-mon-compte" onClick={::this.navigateToAccountPage}>Retourner à la page
                  de mon compte
                </button>
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
                <button className="button-return-mon-compte" onClick={::this.navigateToAccountPage}>Retourner à la page
                  de mon compte
                </button>
              </div>
            </div>
          </div>
        );
      }
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
