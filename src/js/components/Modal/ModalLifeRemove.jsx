import React from 'react'
import ModalComponent from './ModalComponent'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as LifeActionCreators from '../../actions/life'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {
  FormattedMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./ModalLifeRemove.less')
}

@connect(({Life}) => ({Life}))
class ModalLifeRemove extends ModalComponent {

  constructor (props, context) {
    super(props, context)
  }

  closeModal () {
    const {props:{cb}} =this
    super.closeModal()
    if (cb) {
      cb()
    }
  }

  renderContent () {
    return
  }

  render () {
    return ([
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Discard"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ])
  }

}

export default ModalLifeRemove
