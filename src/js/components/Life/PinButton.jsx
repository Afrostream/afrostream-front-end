import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classSet from 'classnames'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import { I18n } from '../Utils'

import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./PinButton.less')
}

@connect(({}) => ({}))
class PinButton extends I18n {

  onClickHandler () {
    const {
      props: {
        dispatch
      }
    } = this
    dispatch(ModalActionCreators.open({target: 'life-add', className: 'large'}))
  }

  render () {
    return (
      <div className={`${this.props.className} pin-btn`} onClick={::this.onClickHandler}>
        <div className="pin-btn_icon">
          <div className="content">
            <i className={this.props.buttonClass}/>
          </div>
        </div>
        <div className="content">
          <p>{this.getTitle(this.props.label)}</p>
        </div>
      </div>
    )
  }

}

PinButton.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  buttonClass: PropTypes.string
}

PinButton.defaultProps = {
  label: '',
  className: '',
  buttonClass: 'zmdi zmdi-pin'
}

export default injectIntl(PinButton)
