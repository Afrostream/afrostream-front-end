import React from 'react'
import SignUpButton from '../../User/SignUpButton'
import { dict } from '../../../../../config'
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

    let info = dict(params.lang).home.devices;

    return (
      <section className="devices">
        <div className="container">
          <div className="device-element-image">
            <div className="visual">
              <img className="hidden-phone"
                   src="https://afrostream.imgix.net/production/poster/2016/01/545c04d6467812742e29-ecrans.gif"/>
            </div>
          </div>
          <div className="device-element-text">
            <h2>{info.title}</h2>
            <ul className="features-list">
              {
                _.map(info.features, (feature, key)=>( <li key={key} className="features-item">{feature}</li>))
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
