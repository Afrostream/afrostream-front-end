import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import _ from 'lodash'
import {
  FormattedMessage
} from 'react-intl'
import ReactImgix from '../../Image/ReactImgix'

if (process.env.BROWSER) {
  require('./Devices.less')
}

class Devices extends React.Component {


  render () {

    const featuresList = [
      'engagment',
      'free',
      'box',
      'hd'
    ]

    return (
      <section className="devices">
        <div className="container-fluid no-padding">
          <ReactImgix className="device-element-image" bg={true}
                      src="https://images.cdn.afrostream.net/production/screen/Macbook-Pro-And-Coffe-Cup-Mockup-.jpg?fit=crop&w=1280&fm=jpg&q=65"/>
          <div className="device-element-text">
            <FormattedMessage tagName="h2" id="home.devices.title"/>
            <ul className="features-list">
              {
                _.map(featuresList, (feature, key) => (
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
