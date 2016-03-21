import React from 'react';
import PaymentForm from './PaymentForm';
import { Link } from 'react-router';
import PaymentImages from './PaymentImages';

if (process.env.BROWSER) {
  require('./SelectPlan.less');
}

class SelectPlan extends React.Component {

  render() {
    return (
      <div className="plan-container">
        <div className="choose-plan">Choisissez la formule qui vous ressemble et profitez
          <span className="choose-plan__bolder"> GRATUITEMENT</span> de 7 jours d'essais
        </div>
        <div className="select-plan">
          <div className="formule-row-no-decoration">
            <div className="row-element-left row-element-top-left"></div>
            <div className="row-element">
              <span className="plan-text blue-text">FORMULE</span>
            </div>
            <div className="row-element">
              <span className="plan-text yellow-text">FORMULE</span>
            </div>
            <div className="row-element">
              <span className="plan-text purple-text">FORMULE</span>
            </div>
          </div>
          <div className="formule-row-no-decoration">
            <div className="row-element-left-header"></div>
            <div className="plan-background blue-background">
              MENSUEL
            </div>
            <div className="plan-background yellow-background">
              AMBASSADEUR
            </div>
            <div className="plan-background purple-background">
              CADEAU
            </div>
          </div>
          <div className="formule-row-decorated-prices">
            <div className="row-element-left">Tarif</div>
            <div className="row-element-prices">
              <span className="plan-price">6,99€</span>
              <span className="plan-period">/MOIS</span>
            </div>
            <div className="row-element-prices">
              <span className="plan-price">59,99€</span>
              <span className="plan-period">/AN</span>
            </div>
            <div className="row-element-prices">
              <span className="plan-price">59,99€</span>
              <span className="plan-period">/AN</span>
            </div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left">HD disponible</div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left">Écrans disponibles en simultané</div>
            <div className="row-element"><strong>1</strong></div>
            <div className="row-element"><strong>2</strong></div>
            <div className="row-element"><strong>2</strong></div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left-twolines">Sur votre ordinateur, TV, smartphone et tablette</div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left">Films et séries TV en illimité</div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left">Sans engagement</div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
          </div>
          <div className="formule-row-decorated">
            <div className="row-element-left">Invitations avant première film</div>
            <div className="row-element"><i className="fa fa-times"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
            <div className="row-element"><i className="fa fa-check"></i></div>
          </div>
          <div className="formule-row-no-decoration">
            <div className="row-element-left"></div>

            <div className="row-element plan-button button-blue">
              <Link
                to='/select-plan/afrostreammonthly/checkout'>
                DÉMARREZ VOTRE<br/> ESSAI GRATUIT
              </Link>
            </div>
            <div className="row-element plan-button button-yellow">
              <Link
                to="/select-plan/afrostreamambassadeurs/checkout">
                DÉMARREZ VOTRE<br/> ESSAI GRATUIT
              </Link>
            </div>
            <div className="row-element plan-button button-purple">
              <Link
                to="/select-plan/afrostreamgift/checkout">
                OFFRIR
              </Link>
            </div>
          </div>
        </div>
        <PaymentImages />
      </div>
    );
  }
}

export default SelectPlan;
