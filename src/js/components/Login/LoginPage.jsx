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
@prepareRoute(async function ({store, location, params}) {

  let {lang} = params
  let {query} = location
  let {data} = query

  const langPath = lang && `${lang}/` || ''
  let target = 'show'
  let closable = true

  switch (true) {
    case ~location.pathname.indexOf(`/reset`):
      target = `showReset`
      break
    case ~location.pathname.indexOf(`/signup`):
      target = `showSignup`
      break
    case ~location.pathname.indexOf(`/signin`):
      target = `showSignin`
      break
    case ~location.pathname.indexOf(`/newsletter`):
      target = `newsletter`
      break
    case ~location.pathname.indexOf(`/parrainage`):
      target = `sponsorship`
      break
    case ~location.pathname.indexOf(`/coupon`):
      if (data) {
        const decodedData = decodeSafeUrl(data)
        await store.dispatch(BillingActionCreators.createCoupon(decodedData))
      }
      console.log('match')
      target = `redeemCoupon`
      break
    default :
      target = `geowall`
      break
  }

  await store.dispatch(ModalActionCreators.open({target, closable}))
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

    let imageStyle = {backgroundImage: `url(${config.images.urlPrefix}${config.metadata.shareImage}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=1280&q=${config.images.quality}&fm=${config.images.type}&blur=50)`}

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

LoginPage.propTypes = {
  modalType: React.PropTypes.string,
  closable: React.PropTypes.bool
}

LoginPage.defaultProps = {
  modalType: 'signin',
  closable: true
}

export default LoginPage
