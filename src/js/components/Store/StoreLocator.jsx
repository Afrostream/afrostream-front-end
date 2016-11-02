import React, { PropTypes } from 'react'
import { prepareRoute } from '../../decorators'
import config from '../../../../config'
import * as EventActionCreators from '../../actions/event'
import scriptLoader from '../../lib/script-loader'
import { withRouter } from 'react-router'
import TextField from 'material-ui/TextField'
import { getI18n } from '../../../../config/i18n'
import {
  purple800
} from 'material-ui/styles/colors'

const {gmapApi} = config

const textStyle = {
  color: purple800
}

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
        icon: '/images/flat-marker.png'
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
    })

    google.maps.event.addListener(this.map, 'idle', ::this.findMarkers)

    this.findMarkers()
  }

  findMarkers () {
    const bounds = this.map && this.map.getBounds()
    if (!bounds) {
      return
    }
    const geo = bounds && bounds.getCenter()
    const zoom = this.map.getZoom()

    const center = bounds.getCenter()
    const ne = bounds.getNorthEast()

// r = radius of the earth in statute miles
    const r = 3963.0

// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    const divider = 57.2958
    const lat1 = center.lat() / divider
    const lon1 = center.lng() / divider
    const lat2 = ne.lat() / divider
    const lon2 = ne.lng() / divider

// distance = circle radius from center to Northeast corner of bounds
    const dis = Math.round(r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)))


    this.map.data.forEach((e)=> {
      this.map.data.remove(e)
    })


    this.map.data.loadGeoJson(config.apiClient.urlPrefix + '/api/stores?latitude=' + geo.lat() + '&longitude=' + geo.lng() + '&distance=' + dis)
  }

  searchLocation () {
    clearTimeout(this.serachTimeout)
    this.serachTimeout = setTimeout(()=> {
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
    }, 300)
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
      <div className="row-fluid store-locator-page">
        <div className="container-fluid brand-bg">
          <section className="info">
            <h2>{getI18n().storesLocator.title}</h2>
            <p>{getI18n().storesLocator.description}</p>
          </section>
          <section>
            <h3>{getI18n().storesLocator.where}</h3>
            <TextField id="map-search" defaultValue={this.state.location} onChange={::this.searchLocation}
                       floatingLabelFixed={true}
                       floatingLabelStyle={textStyle}
                       disabledStyle={textStyle}
                       hintStyle={textStyle}
                       underlineStyle={textStyle}
                       hintText={getI18n().storesLocator.inputFind} floatingLabelText={getI18n().storesLocator.find}/>
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
