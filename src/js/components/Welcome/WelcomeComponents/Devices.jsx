import React from 'react';
import SignUpButton from '../../User/SignUpButton';

if (process.env.BROWSER) {
  require('./Devices.less');
}

class Devices extends React.Component {


  render() {

    return (
      <section className="devices">
        <div className="container">
          <div className="device-element-image">
            <div className="visual">
              <img className="hidden-phone"
                   src="https://afrostream.imgix.net/production/poster/2016/01/545c04d6467812742e29-ecrans.gif"/>
            </div>
          </div>
          <div className="device-element-text">
            <h2>Vos films et séries afro préférés quand vous voulez où vous voulez en illimité</h2>
            <ul className="features-list">
              <li className="features-item">
                Visionnez en streaming illimité
              </li>
              <li className="features-item">
                En versions sous-titrées ou vost
              </li>
              <li className="features-item">
                Aucune publicité, aucune interruption
              </li>
              <li className="features-item">
                Profitez d'une image haute qualité
              </li>
            </ul>
            <SignUpButton label="J'en profite !"/>
          </div>
        </div>
      </section>
    );
  }
}

export default Devices;
