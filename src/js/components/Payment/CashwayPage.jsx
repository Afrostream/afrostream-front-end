import React, { PropTypes } from 'react';
import SignUpButton from '../User/SignUpButton';
import { prepareRoute } from '../../decorators';
import * as EventActionCreators from '../../actions/event';

if (process.env.BROWSER) {
  require('./CashwayPage.less');
}

@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class CashwayPage extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      location: ''
    };
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  componentDidMount () {
    const {
      props: {}
    } = this;
    if (navigator.geolocation) {
      let self = this;
      navigator.geolocation.getCurrentPosition((position)=> {
        self.setState({
          location: position.coords.latitude + ' ' + position.coords.longitude
        });
      });
    }
  }

  render () {

    const {props: {children}} = this;

    if (children) {
      return children;
    }

    return (
      <div className="cashway-page">
        <div className="container brand-bg-alpha">
          <section className="cashway-info">
            <h2>Paiement en espèces</h2>
            <h3>Comment ça marche</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-2">
                    <div className='number'>1</div>
                  </div>
                  <div className="col-md-10">
                    <div className="container_title">Le commerçant scanne votre code-barre</div>
                  </div>
                </div>
                <img className="img-responsive img-center"
                     src="http://cw2.mo.772424.com/wp-content/uploads/2015/04/code_bare_ccm.png" alt="code_bare_ccm"/>

              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-2">
                    <div className='number'>2</div>
                  </div>
                  <div className="col-md-10">
                    <div className="container_title">Vous payez en espèces</div>
                  </div>
                </div>
                <img className="img-responsive img-center"
                     src="http://cw2.mo.772424.com/wp-content/uploads/2015/04/money_ccm.png" alt="money_ccm"/>

              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-2">
                    <div className='number'>3</div>
                  </div>
                  <div className="col-md-10">
                    <div className="container_title">Votre commande est validée ! Vous recevez un message de
                      confirmation,
                      et
                      vous pouvez profiter du service instantanément
                    </div>
                  </div>
                </div>
                <img className="img-responsive img-center"
                     src="http://cw2.mo.772424.com/wp-content/uploads/2015/04/validate_ccm.png" alt="validate_ccm"/>

              </div>
            </div>
          </section>
          <section className="cashway-plan">
            <h3> Où payer en espèces ?</h3>
            <div className="form-group col-md-12">
              <span className="form-label" htmlFor="number">Trouver un point de vente</span>
            </div>
            <div className="form-group col-md-10">
              <input type="text" id="cashway-map-search" defaultValue={this.state.location} className="form-control"/>
            </div>
            <div className="form-group col-md-2">
              <button className="btn btn-default" id="cashway-map-search-btn">Verifier</button>
            </div>
            <div id="cashway-map-canvas" className="cashway-map-canvas"></div>
          </section>
          <section className="cashway-signup ">
            <div className="row-fluid">
              <div className="col-md-12 text-center">
                <SignUpButton label="RECEVOIR MON CODE" to="/cash/select-plan"/>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default CashwayPage;
