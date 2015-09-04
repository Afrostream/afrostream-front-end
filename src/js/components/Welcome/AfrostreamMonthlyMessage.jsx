import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import LogOutButton from '../../components/User/LogOutButton';
if (process.env.BROWSER) {
  require('./AfrostreamMonthlyMessage.less');
}

class AfrostreamMonthlyMessage extends React.Component {


  render() {
    return (
      <section className="afrostream-monthly-message">
        <div className="header">
        </div>
        <div className="message-container">
          <h3>Merci d'avoir réservé la formule THINK LIKE A MAN. </h3>

          <p>Rendez vous le 1er octobre pour profiter de votre abonnement.</p>

          <LogOutButton />
        </div>
      </section>
    );
  }
}

export default AfrostreamMonthlyMessage;
