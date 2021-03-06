import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import SignUpButton from '../User/SignUpButton'
import config from '../../../../config'
import * as EventActionCreators from '../../actions/event'
import scriptLoader from '../../lib/script-loader'
import FloatPlayer from '../Player/FloatPlayer'
import { withRouter } from 'react-router'
import window from 'global/window'

const {cashwayApi} = config

if (process.env.BROWSER) {
  require('./CashwayPage.less')
}

class CashwayPage extends React.Component {

  state = {
    location: ''
  }

  constructor (props) {
    super(props)
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {
      props: {isScriptLoaded, isScriptLoadSucceed}
    } = this
    if (isScriptLoaded && isScriptLoadSucceed) {
      window.cashwayMapInit()
    }
    const data = Immutable.fromJS({
      sources: [
        {type: 'video/youtube', src: 'https://www.youtube.com/watch?v=gx5p0ZD88EM'}
      ]
    })
    this.setState({
      data
    })
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        window.cashwayMapInit()
      }
    }
  }

  render () {

    const {props: {children}} = this

    if (children) {
      return children
    }

    return (
      <div className="cashway-page">
        <div className="container brand-bg-alpha">
          <FloatPlayer float={false} data={this.state.data} {...this.props} />
          <section className="cashway-info">
            <h2>Paiement en espèces avec <img src="/images/payment/cashway-inline.png" width="100"/></h2>
            <h3>Comment ça marche</h3>
            <div className="row-fluid">
              <div className="col-xs-12 col-md-4">
                <div className='number'>1</div>
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-1.jpg" alt="code_bare_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">Le commerçant scanne votre code-barre</div>
                  </div>
                </div>

              </div>
              <div className="col-xs-12 col-md-4">
                <div className='number'>2</div>
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-2.jpg" alt="money_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">Vous payez en espèces</div>
                  </div>
                </div>

              </div>
              <div className="col-xs-12 col-md-4">
                <div className='number'>3</div>
                <img className="img-responsive img-center"
                     src="/images/payment/cashway/step-3.jpg" alt="validate_ccm"/>
                <div className="row-fluid">
                  <div className="col-md-12">
                    <div className="container_title">Votre commande est validée ! Vous recevez un message de
                      confirmation,
                      et
                      vous pouvez profiter du service instantanément
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
          <section className="cashway-signup ">
            <div className="row-fluid">
              <div className="col-md-12 text-center">
                <SignUpButton label="RECEVOIR MON CODE" to="/cash/select-plan"/>
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
    )
  }
}
export default scriptLoader(
  cashwayApi
)(withRouter(CashwayPage))
