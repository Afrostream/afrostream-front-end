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

  onClickHandler (e) {
    const {
      props: {
        dispatch,
        target,
        data
      }
    } = this
    e.preventDefault()
    dispatch(ModalActionCreators.open({target, className: 'large', data}))
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
  data: PropTypes.instanceOf(Immutable.Map),
  target: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  buttonClass: PropTypes.string
}

PinButton.defaultProps = {
  target: 'life-add',
  label: '',
  className: '',
  buttonClass: 'zmdi zmdi-pin'
}

export default injectIntl(PinButton)
