import React from 'react'
import { connect } from 'react-redux'
import ModalNewsletter from './ModalNewsletter'
import ModalGeoWall from './ModalGeoWall'
import ModalLogin from './ModalLogin'
import ModalSocial from './ModalSocial'
import ModalCoupon from './ModalCoupon'
import ModalCashwayPlan from './ModalCashwayPlan'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./ModalView.less')
}

@connect(({Modal}) => ({Modal}))
class ModalView extends React.Component {

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  }

  render () {
    const {
      props: {
        Modal
      }
    } = this

    const target = Modal.get('target')
    const closable = Modal.get('closable')
    const data = Modal.get('data')
    const cb = Modal.get('cb')

    switch (target) {
      case 'newsletter':
        return (
          <ModalNewsletter closable={closable} {...this.props}
                           header="Newsletter"
                           instructions="Me tenir informé par email"
                           action="Envoyer"/>
        )
        break
      case 'geoWall':
        return (
          <ModalGeoWall closable={closable} {...this.props}/>
        )
        break
      case 'cashway':
        return (
          <ModalCashwayPlan closable={closable} {...this.props}/>
        )
        break
      case 'show':
      case 'showSignin':
      case 'showSignup':
      case 'showReset':
      case 'showGift':
      case 'showRelog':
      case 'showProvider':
        return (
          <ModalLogin type={target} closable={closable} cb={cb} {...this.props}/>
        )
        break
      case 'redeemCoupon':
        return (
          <ModalCoupon type={target} closable={closable} {...this.props}/>
        )
        break
      case 'strategy':
        return (
          <ModalSocial closable={closable} {...this.props} data={data}/>
        )
        break
      default:
        return <div />
    }
  }
}

ModalView.propTypes = {
  location: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func
}

export default withRouter(ModalView)
