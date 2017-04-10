import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import _ from 'lodash'
import {
  FormattedMessage
} from 'react-intl'
import ReactImgix from '../../Image/ReactImgix'
import { connect } from 'react-redux'
import { I18n } from '../../Utils'
import config from '../../../../../config'
import {
  injectIntl,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Devices.less')
}

const {images} = config

@connect(({Movie}) => ({Movie}))
class Devices extends I18n {


  render () {
    const {
      props: {
        params,
        Movie,
        router
      }
    } = this

    let {movieId} = params

    const currenMovie = Movie.get(`movies/${movieId}`)
    const movieName = currenMovie && `${currenMovie.get('title')} ${this.getTitle('and')} ` || ''

    const isOnUk = router.isActive('uk')

    const featuresList = [
      'engagment',
      'free',
      'box',
      'hd'
    ]

    let posterImg = `${images.urlPrefix}/production/screen/mockup-${isOnUk ? 'uk' : 'fr'}-3.jpg?fit=crop&w=1280&q=${images.quality}&fm=${images.type}`

    return (
      <section className="devices">
        <div className="container-fluid no-padding">
          <ReactImgix className="device-element-image" bg={true} blur={false}
                      src={posterImg}/>
          <div className="device-element-text">
            <FormattedMessage tagName="h2" id="home.devices.title" values={{movieName}}/>
            <ul className="features-list">
              {
                _.map(featuresList, (feature, key) => (
                  <li key={key} className="features-item">
                    <i className="zmdi zmdi-check"/>
                    <FormattedMessage id={`home.devices.features.${feature}`}/>
                  </li>))
              }
            </ul>
            <SignUpButton label="home.devices.action" title="home.devices.titleAction" values={{movieName}}/>
          </div>
        </div>
      </section>
    )
  }
}

export default injectIntl(Devices)
