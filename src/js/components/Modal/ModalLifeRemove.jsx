import React from 'react'
import ModalComponent from './ModalComponent'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'

import * as EventActionCreators from '../../actions/event'

import FlatButton from 'material-ui/FlatButton'

if (process.env.BROWSER) {
  require('./ModalLifeRemove.less')
}

@connect(({Life}) => ({Life}))
class ModalLifeRemove extends ModalComponent {

  constructor (props, context) {
    super(props, context)
  }

  finalyse () {
    const {props:{data, dispatch}} =this
    if (data) {
      const pinId = data.get('_id')
      return dispatch(LifeActionCreators.removePin(pinId)).then(() => {
        dispatch(EventActionCreators.snackMessage({message: 'life.modal.removeSuccess'}))
        this.closeModal()
      })
    }
    this.closeModal()
  }

  getI18n () {
    return 'life'
  }


  renderFooter () {
    return ([
      <FlatButton
        key="remove-pin-cancel"
        label={this.getTitle('modal.cancelAction')}
        primary={true}
        onTouchTap={::this.handleClose}
      />,
      <FlatButton
        key="remove-pin-action"
        label={this.getTitle('modal.okAction')}
        primary={true}
        onTouchTap={::this.finalyse}
      />
    ])
  }

}

export default ModalLifeRemove
