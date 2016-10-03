import React, { PropTypes } from 'react'
import { prepareRoute } from '../../decorators'
import config from '../../../../config'
import * as EventActionCreators from '../../actions/event'
import scriptLoader from '../../lib/script-loader'
import { withRouter } from 'react-router'

const {gmapApi} = config

if (process.env.BROWSER) {
  require('./StoreLocator.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
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

    this.map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 10,
      center: new google.maps.LatLng(48.856614, 2.352222),
      disableDefaultUI: false,
      scrollwheel: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{
        'featureType': 'all',
        'elementType': 'all',
        'stylers': [
          //{'visibility': 'simplified'},
          {'lightness': '22'}
        ]
      }, {
        'featureType': 'all',
        'elementType': 'labels',
        //'stylers': [{'visibility': 'off'}]
      }]
    })

    this.geoCoder = new google.maps.Geocoder()

    const infowindow = new google.maps.InfoWindow()

    this.map.data.setStyle((feature)=> {
      return {
        title: feature.getProperty('name') || null,
        icon: 'http://www.google.com/mapfiles/marker.png'
      }
    })

    this.map.data.addListener('click', function (event) {
      const name = event.feature.getProperty('name')
      const adresse = event.feature.getProperty('adresse')
      const ville = event.feature.getProperty('ville')
      const cp = event.feature.getProperty('cp')
      const phone = event.feature.getProperty('phone')
      infowindow.setContent(`<div style="width:150px; text-align: left;"><div >${name}</div><div>${adresse} ${cp} ${ville} - +33${phone}</div></div>`)
      infowindow.setPosition(event.feature.getGeometry().get())
      infowindow.setOptions({pixelOffset: new google.maps.Size(0, -30)})
      infowindow.open(this.map)
    });

    google.maps.event.addListener(this.map, 'idle', ::this.findMarkers)

    this.findMarkers()
  }

  findMarkers () {
    const bound = this.map && this.map.getBounds()
    const geo = bound && bound.getCenter()
    if (!geo) {
      return
    }
    const zoom = this.map.getZoom()

    this.map.data.forEach((e)=> {
      this.map.data.remove(e)
    })

    this.map.data.loadGeoJson(config.apiClient.urlPrefix + '/api/stores?latitude=' + geo.lat() + '&longitude=' + geo.lng() + '&zoom=' + zoom)
  }

  searchLocation () {
    const e = document.getElementById('map-search')
    this.geoCoder.geocode({
        address: e.value,
        region: 'FR'
      }, (result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            this.map.setCenter(result[0].geometry.location)
          }
        }
      }
    )
  }

  componentDidMount () {
    const {
      props: {isScriptLoaded, isScriptLoadSucceed}
    } = this
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initMap()
    }
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initMap()
      }
    }
  }

  render () {

    const {props: {children}} = this

    if (children) {
      return children
    }

    return (
      <div className="store-locator-page">
        <div className="container-fluid brand-bg-alpha">
          <section className="cashway-info">
            <h2>Abonnez-vous à Afrostream au coin de la rue</h2>
            <p>Il n’a jamais été aussi simple de s’abonner à Afrostream.
              Vous pouvez désormais vous rendre chez un buraliste et vous abonner pour 1 (6,99€) ou 3 mois (18,99€) à
              Afrostream.
              Trouvez le bureau de tabac le plus proche de chez vous grâce à cette carte et profitez des meilleurs
              films
              et séries afro.</p>
          </section>
          <section className="cashway-plan">
            <h3> Où payer en espèces ?</h3>
            <div className="form-group col-md-12">
              <span className="form-label" htmlFor="number">Trouver un point de vente</span>
            </div>
            <div className="form-group col-md-10">
              <input type="text" id="map-search" defaultValue={this.state.location} className="form-control"/>
            </div>
            <div className="form-group col-md-2">
              <button className="btn btn-default" id="map-search-btn" onClick={::this.searchLocation}>Verifier
              </button>
            </div>
            <div id="map-canvas" className="map-canvas"></div>
          </section>
        </div>
      </div>
    )
  }
}

export
default

scriptLoader(gmapApi)

(
  withRouter(StoreLocator)
)
