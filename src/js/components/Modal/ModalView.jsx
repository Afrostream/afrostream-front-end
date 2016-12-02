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
import ModalLifeRemove from './ModalLifeRemove'
import { SelectPlan } from '../../components/Payment/'
import { withRouter } from 'react-router'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

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
        Modal, params:{lang}
      }
    } = this

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Discard"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ]

    const type = Modal.get('target')
    const closable = Modal.get('closable')
    const data = Modal.get('data')
    const cb = Modal.get('cb')
    const className = Modal.get('className')
    switch (type) {
      case 'newsletter':
      case 'geowall':
        const header = `${type}.header`
        const instructions = `${type}.instructions`
        const result = `${type}.result`
        const action = `${type}.action`
        return (
          <ModalNewsletter closable={closable} {...this.props}
                           {...{header, instructions, result, action}}
          />
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
      case 'life-remove':
        return <ModalLifeRemove {...{closable, cb, type, className, data}} {...this.props} />
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
