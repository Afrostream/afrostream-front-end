import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import _ from 'lodash'
import {
  FormattedMessage
} from 'react-intl'
import ReactImgix from '../../Image/ReactImgix'
import { connect } from 'react-redux'
import { I18n } from '../../Utils'
import {
  injectIntl,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Devices.less')
}
@connect(({Movie}) => ({Movie}))
class Devices extends I18n {


  render () {
    const {
      props: {
        params,
        Movie
      }
    } = this

    let {movieId} = params

    const currenMovie = Movie.get(`movies/${movieId}`)
    const movieName = currenMovie && `${currenMovie.get('title')} ${this.getTitle('and')} ` || ''

    const featuresList = [
      'engagment',
      //'free',
      'box',
      'hd'
    ]

    return (
      <section className="devices">
        <div className="container-fluid no-padding">
          <ReactImgix className="device-element-image" bg={true} blur={false}
                      src="https://images.cdn.afrostream.net/production/screen/mockup-uk.jpg?fit=crop&w=1280&fm=jpg&q=65"/>
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
