import React from 'react';
import PaymentForm from './PaymentForm';
import PaymentImages from './PaymentImages';

if (process.env.BROWSER) {
  require('./SelectPlan.less');
}

class SelectPlan extends React.Component {

  state = {
    planName: '',
    unitAmountInCents: '',
    startDate: ''
  };

  selectPlan(planName, unitAmountInCents, startDate) {

    this.setState({
      planName: planName,
      unitAmountInCents: unitAmountInCents,
      startDate: startDate
    });
  }

  componentDidMount() {
  }


  render() {

    if (this.state.planName !== '') {

      return (
        <PaymentForm
          planName={this.state.planName}
          unitAmountInCents={this.state.unitAmountInCents}
          startDate={this.state.startDate}/>
      );

    } else {

      return (
        <div className="plan-container">
          <div className="choose-plan">Choisissez la formule qui vous ressemble</div>
          <div className="select-plan">
            <div className="formule-row-no-decoration">
              <div className="row-element-left row-element-top-left"></div>
              <div className="row-element">
                <span className="blue-text">FORMULE</span>
              </div>
              <div className="row-element">
                <span className="yellow-text">FORMULE</span>
              </div>
              <div className="row-element">
                <span className="purple-text">FORMULE</span>
              </div>
            </div>
            <div className="formule-row-no-decoration">
              <div className="row-element-left-header"></div>
              <div className="blue-background">
                THINK LIKE A MAN
              </div>
              <div className="yellow-background">
                AMBASSADEUR
              </div>
              <div className="purple-background">
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
              <div className="row-element">
                <button className="button-blue"
                        onClick={this.selectPlan.bind(this, 'afrostreammonthly', '699', '2015-10-01T00:00:00:00Z')}>
                  S'ABONNER
                </button>
              </div>
              <div className="row-element">
                <button className="button-yellow"
                        onClick={this.selectPlan.bind(this, 'afrostreamambassadeurs', '5999', '2015-09-01T00:00:00:00Z')}>
                  S'ABONNER
                </button>
              </div>
              <div className="row-element">
                <button className="button-purple"
                        onClick={this.selectPlan.bind(this, 'afrostreamgift', '5999', '2015-09-01T00:00:00:00Z')}>
                  OFFRIR
                </button>
              </div>
            </div>
          </div>
          <PaymentImages />
        </div>
      );
    }
  }
}

export default SelectPlan;
