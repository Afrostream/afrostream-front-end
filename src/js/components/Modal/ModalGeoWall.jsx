import React from 'react'
import * as ModalActionCreators from '../../actions/modal'
import * as WaitingUsersActionCreators from '../../actions/waitingUsers'
import ModalComponent from './ModalComponent'
import classNames from 'classnames'
import {
  FormattedMessage,
} from 'react-intl'

class ModalGeoWall extends ModalComponent {

  constructor (props, context) {
    super(props, context)
  }


  state = {
    sended: false,
    email: ''
  }

  initState () {
    this.setState({
      sended: false,
      email: ''
    })
  }

  handleSubmit (e) {
    e.stopPropagation()
    e.preventDefault()
    const email = this.refs.email.value
    this.props.dispatch(WaitingUsersActionCreators.create(email)).then(()=> {
      this.setState({
        sended: true,
        email: email
      })
      setTimeout(::this.initState, 10000)
    })

  }

  handleClose (e) {
    if (this.props.closable) {
      super.handleClose(e)
    }
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    let popupClass = classNames({
      'popup': this.props.modal
    })

    let overlayClass = classNames({
      'overlay': this.props.modal,
      'widget': !this.props.modal,
      'active': true
    })

    let panelClass = {
      'panel onestep active': true,
    }

    const classType = 'geoWall'

    panelClass[this.props.className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <FormattedMessage tagName="h1" id={`${this.props.header}`}/>
                      <a className={closeClass}  onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <form onSubmit={::this.handleSubmit}>
                          <div className="instructions">
                            <FormattedMessage id={`${this.props.instructions}`}/>
                          </div>
                          <div className="emailPassword">
                            <div className="inputs">
                              <div className="email">
                                <label htmlFor="easy_email" className="sad-placeholder">
                                  Email
                                </label>
                                <div className="input-box">
                                  <i className="icon-budicon-5"></i>
                                  <input name="email" ref="email" id="easy_email" type="email"
                                         placeholder="example@address.com"
                                         title="email"/>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="primary next">
                            <FormattedMessage id={`${this.props.action}`}/>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalGeoWall.propTypes = {
  header: React.PropTypes.string,
  instructions: React.PropTypes.string,
  action: React.PropTypes.string,
  result: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  closable: React.PropTypes.bool,
  modal: React.PropTypes.bool
}

ModalGeoWall.defaultProps = {
  header: '',
  instructons: '',
  action: '',
  result: '',
  modal: true
}

export default ModalGeoWall
