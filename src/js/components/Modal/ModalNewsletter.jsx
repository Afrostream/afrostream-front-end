import React from 'react'
import ModalGeoWall from './ModalGeoWall'
import * as WaitingUsersActionCreators from '../../actions/waitingUsers'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import {
  FormattedMessage,
} from 'react-intl'

class ModalNewsletter extends ModalGeoWall {

  constructor(props, context) {
    super(props, context)
  }

  state = {
    sended: false,
    email: ''
  }

  handleClose(e) {
    const {
      props: {history}
    } = this

    //history.push('/')
    super.handleClose(e)
  }

  initState() {
    this.setState({
      sended: false,
      email: ''
    })
  }

  handleSubmit(e) {
    e.stopPropagation()
    e.preventDefault()
    const email = this.refs.email.value
    this.props.dispatch(WaitingUsersActionCreators.create(email)).then(() => {
      this.setState({
        sended: true,
        email: email
      })
      setTimeout(::this.initState, 10000)
    })
  }

  render() {
    if (!this.state.sended) {
      return super.render()
    }

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
        <div id="lock" className="lock theme-default geoWall">
          <div className={classType}>
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <FormattedMessage tagName="h1" id={`${this.props.header}`}/>
                      <a className={closeClass} onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="instructions">
                          <FormattedMessage id={`${this.props.result}`}/>
                        </div>
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

ModalNewsletter.propTypes = {
  history: React.PropTypes.object.isRequired
}

ModalNewsletter.defaultProps = {
  modal: true
}

export default withRouter(ModalNewsletter)
