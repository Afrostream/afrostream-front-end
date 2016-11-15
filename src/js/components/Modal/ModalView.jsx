import React from 'react'
import { connect } from 'react-redux'
import ModalNewsletter from './ModalNewsletter'
import ModalGeoWall from './ModalGeoWall'
import ModalLogin from './ModalLogin'
import ModalSocial from './ModalSocial'
import ModalCoupon from './ModalCoupon'
import ModalCashwayPlan from './ModalCashwayPlan'
import ModalSponsors from './ModalSponsors'
import ModalPlayer from './ModalPlayer'
import ModalImage from './ModalImage'
import ModalComponent from './ModalComponent'
import ModalLifeAdd from './ModalLifeAdd'
import { SelectPlan } from '../../components/Payment/'
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

    const type = Modal.get('target')
    const closable = Modal.get('closable')
    const data = Modal.get('data')
    const cb = Modal.get('cb')
    const className = Modal.get('className')

    switch (type) {
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
      case 'showRelog':
      case 'showProvider':
      case 'linkProvider':
      case 'life-user':
        return (
          <ModalLogin {...{closable, cb, type, className}} {...this.props}/>
        )
        break
      case 'redeemCoupon':
        return (
          <ModalCoupon {...{closable, cb, type, className}} {...this.props}/>
        )
        break
      case 'strategy':
        return (
          <ModalSocial {...{closable, cb, type, className, data}} {...this.props} />
        )
        break
      case 'sponsorship':
        return (
          <ModalSponsors {...{closable, cb, type, className, data}} {...this.props} />
        )
        break
      case 'player':
        return (
          <ModalPlayer {...{closable, cb, type, className, data}} {...this.props} />
        )
        break
      case 'player':
        return (
          <ModalPlayer {...{closable, cb, type, className, data}} {...this.props}/>
        )
        break
      case 'image':
        return (
          <ModalImage {...{closable, cb, type, className, data}} {...this.props} />
        )
        break
      //LIFE ACL
      case 'life-premium':
      case 'life-vip':
        return <ModalComponent {...{closable, cb, type, className, data}} {...this.props}><SelectPlan {...this.props}
                                                                                                      showImages={false}/></ModalComponent>
        break
      case 'life-add':
        return <ModalLifeAdd {...{closable, cb, type, className, data}} {...this.props} />
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
