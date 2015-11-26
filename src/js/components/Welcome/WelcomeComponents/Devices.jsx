import React from 'react';

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
              <img className="hidden-phone" src="/images/ecrans.png"/>
            </div>
          </div>
          <div className="device-element-text">
            <h2>Vos films et séries afro préférés quand vous voulez où vous voulez en illimité</h2>
            <ul className="features-list">
              <li className="features-item">
                Visionnez en streaming illimité
              </li>
              <li className="features-item">
                En versions sous-titrées ou versions françaises
              </li>
              <li className="features-item">
                Aucune publicité, aucune interruption
              </li>
              <li className="features-item">
                Profitez d'une image haute qualité
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default Devices;
