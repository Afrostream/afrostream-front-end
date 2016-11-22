import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import _ from 'lodash'
import {
  FormattedMessage
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Devices.less')
}

class Devices extends React.Component {


  render () {

    const {
      props: {
        intl
      }
    } = this

    const featuresList = [
      'engagment',
      'free',
      'box',
      'hd'
    ]

    return (
      <section className="devices">
        <div className="container">
          <div className="device-element-image">
            <div className="visual">
              <img className="hidden-phone"
                   src="https://images.cdn.afrostream.net/production/poster/2016/08/44d9f393719a65321620-devices-fullHD.png?fit=crop&w=600&fm=jpg&q=65&bg=131313"/>
            </div>
          </div>
          <div className="device-element-text">
            <FormattedMessage tagName="h2" id="home.devices.title"/>
            <ul className="features-list">
              {
                _.map(featuresList, (feature, key)=>(
                  <li key={key} className="features-item">
                    <i className="zmdi zmdi-check"/>
                    <FormattedMessage id={`home.devices.features.${feature}`}/>
                  </li>))
              }
            </ul>
            <SignUpButton label="home.devices.action"/>
          </div>
        </div>
      </section>
    )
  }
}

export default Devices
