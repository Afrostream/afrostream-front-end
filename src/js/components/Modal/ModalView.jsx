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
import ModalComponent from './ModalComponent'
import ReactImgix from '../Image/ReactImgix'
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
      case 'showRelog':
      case 'showProvider':
      case 'linkProvider':
      case 'life-user':
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
      case 'sponsorship':
        return (
          <ModalSponsors closable={closable} {...this.props} data={data}/>
        )
        break
      case 'player':
        return (
          <ModalPlayer closable={closable} {...this.props} data={data}/>
        )
        break
      case 'player':
        return (
          <ModalPlayer closable={closable} {...this.props} data={data}/>
        )
        break
      case 'image':
        return (
          <ModalComponent closable={closable} className="large" {...this.props} >
            <div className="modal-image-container">
              <div className="content">
                <ReactImgix className="modal-image" src={data.get('src')} bg={true}/>
              </div>
            </div>
          </ModalComponent>
        )
        break
      //LIFE ACL
      case 'life-premium':
      case 'life-vip':
        return <ModalComponent closable={closable} className="large" {...this.props}><SelectPlan {...this.props}
                                                                                                 showImages={false}/></ModalComponent>
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
