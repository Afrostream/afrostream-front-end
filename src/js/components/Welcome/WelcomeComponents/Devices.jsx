import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import { getI18n } from '../../../../../config/i18n'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./Devices.less')
}

class Devices extends React.Component {


  render () {

    const {
      props: {
        params
      }
    } = this

    let info = getI18n(params.lang).home.devices

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
            <h2>{info.title}</h2>
            <ul className="features-list">
              {
                _.map(info.features, (feature, key)=>(
                  <li key={key} className="features-item"><i className="zmdi zmdi-check"></i>{feature}</li>))
              }
            </ul>
            <SignUpButton label={info.action}/>
          </div>
        </div>
      </section>
    )
  }
}

export default Devices
