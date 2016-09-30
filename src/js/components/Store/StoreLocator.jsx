import React, { PropTypes } from 'react'
import SignUpButton from '../User/SignUpButton'
import { prepareRoute } from '../../decorators'
import config from '../../../../config'
import * as ConfigActionCreators from '../../actions/config'
import * as EventActionCreators from '../../actions/event'
import scriptLoader from '../../lib/script-loader'
import Player from '../Player/Player'
import { withRouter } from 'react-router'

const {gmapApi} = config

if (process.env.BROWSER) {
  require('./StoreLocator.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(ConfigActionCreators.getConfig('store'))
  ])
})
@connect(({Config}) => ({Config}))
class StoreLocator extends React.Component {

  state = {
    location: ''
  }

  constructor (props) {
    super(props)
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  initMap () {
    const map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 2,
      center: new google.maps.LatLng(2.8, -187.3),
      mapTypeId: 'terrain'
    })
    map.data.loadGeoJson('stores')
  }

  componentDidMount () {
    const {
      props: {isScriptLoaded, isScriptLoadSucceed}
    } = this
    if (isScriptLoaded && isScriptLoadSucceed) {
      initMap()
    }
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        initMap()
      }
    }
  }

  render () {

    const {props: {children}} = this

    if (children) {
      return children
    }

    const source = [
      {type: 'video/youtube', src: 'https://www.youtube.com/watch?v=gx5p0ZD88EM'}
    ]

    return (
      <div className="store-locator-page">
        <div className="container brand-bg-alpha">
          <Player src={source} options={{autoplay: false}}/>
          <section className="cashway-info">
            <h2>Abonnez-vous à Afrostream au coin de la rue</h2>
            <p>Il n’a jamais été aussi simple de s’abonner à Afrostream.
              Vous pouvez désormais vous rendre chez un buraliste et vous abonner pour 1 (6,99€) ou 3 mois (18,99€) à
              Afrostream.
              Trouvez le bureau de tabac le plus proche de chez vous grâce à cette carte et profitez des meilleurs films
              et séries afro.</p>
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
            <div id="map-canvas" className="map-canvas"></div>
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
  gmapApi
)(withRouter(StoreLocator))
