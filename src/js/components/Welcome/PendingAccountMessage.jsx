import React from 'react';
import LogOutButton from '../../components/User/LogOutButton';
if (process.env.BROWSER) {
  require('./AfrostreamMonthlyMessage.less');
}

class PendingAccountMessage extends React.Component {


  render() {
    return (
      <section className="afrostream-monthly-message">
        <div className="header">
        </div>
        <div className="message-container">
          <h3>Votre compte est en cours de validation</h3>

          <p>Vous allez recevoir un mail de confirmation une fois votre payment finalisé.</p>

          <LogOutButton />
        </div>
      </section>
    );
  }
}

export default PendingAccountMessage;
