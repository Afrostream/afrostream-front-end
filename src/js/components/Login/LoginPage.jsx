import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import { decodeSafeUrl } from '../../lib/utils'
import * as BillingActionCreators from '../../actions/billing'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../../config'
import * as ModalActionCreators from '../../actions/modal'

if (process.env.BROWSER) {
  require('./LoginPage.less')
}
@prepareRoute(async function ({store, location}) {

  let {query} = location
  let {data} = query

  let method
  switch (location.pathname) {
    case '/signup':
      method = 'showSignup'
      break
    case '/signin':
      method = 'showSignin'
      break
    case '/newsletter':
      method = 'newsletter'
      break
    case '/parrainage':
      method = 'sponsorship'
      break
    case '/coupon':
      if (data) {
        const decodedData = decodeSafeUrl(data)
        await store.dispatch(BillingActionCreators.createCoupon(decodedData))
      }
      method = 'redeemCoupon'
      break
    default :
      method = 'show'
      break
  }

  await store.dispatch(ModalActionCreators.open({target: method}))
})
@connect(({User}) => ({User}))
class LoginPage extends React.Component {

  state = {
    isMobile: false,
    size: {
      height: 1280,
      width: 500
    }
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  render () {

    let imageStyle = {backgroundImage: `url(${config.images.urlPrefix}${config.metadata.shareImage}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type})`}

    return (
      <div className="row-fluid">
        <div className="login-page" style={imageStyle}>
          <div className="auth-container">
            <div id="login-container">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
